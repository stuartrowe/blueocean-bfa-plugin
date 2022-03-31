import React, { Component, PropTypes } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { ComponentLink, Fetch, i18nTranslator, sseConnection } from '@jenkins-cd/blueocean-core-js';
import { JTable, TableHeaderRow, TableRow, TableCell } from '@jenkins-cd/design-language';
import NoFailureCausesPlaceholder from './NoFailureCausesPlaceholder';

const t = i18nTranslator('blueocean-dashboard');

/**
 * Displays a list of tests from the supplied build run property.
 */
@observer
export class RunDetailsFailureCauses extends Component {
    @observable
    failureCauses;

    constructor(props) {
        super(props);
        this.listener = {};
        this.sseEventHandler = this.sseEventHandler.bind(this);
    }

    propTypes = {
        result: PropTypes.object,
    };

    contextTypes = {
        activityService: PropTypes.object.isRequired,
    };

    componentWillMount() {
        this._fetchFailureCauses(this.props);
    }

    componentDidMount() {
        // get sse listener to react on the different in sse events
        this.listener.ssePipeline = sseConnection.subscribe('pipeline', this.sseEventHandler);
    }

    componentWillReceiveProps(nextProps) {
        this._fetchFailureCauses(nextProps);
    }

    componentWillUnmount() {
        if (this.listener.ssePipeline) {
            sseConnection.unsubscribe(this.listener.ssePipeline);
            delete this.listener.ssePipeline;
        }
    }

    sseEventHandler(event) {
        const jenkinsEvent = event.jenkins_event;
        switch (jenkinsEvent) {
            case 'pipeline_block_start':
            case 'pipeline_block_end': {
                this._fetchFailureCauses(this.props);
            }
        }
    }

    @action
    setFailureCauses(failureCauses) {
        this.failureCauses = failureCauses;
    }

    _fetchFailureCauses(props) {
        const result = props.result;
        if (!result || !result._links || !result._links.self || !result._links.self.href) {
            return;
        }
        const runHref = result._links.self.href;
        Fetch.fetchJSON(`${runHref}bfa/`)
            .then(action => {
                this.setFailureCauses(action.foundFailureCauses);
            })
            .catch(err => {
                this.setFailureCauses(null);
            });
    }

    render() {
        if (!this.failureCauses || !this.failureCauses.length) {
            return <NoFailureCausesPlaceholder t={t} />;
        }

        const nameLabel = t('rundetail.failurecauses.header.name', { defaultValue: 'Name' });
        const categoriesLabel = t('rundetail.failurecauses.header.categories', { defaultValue: 'Categories' });
        const valueLabel = t('rundetail.failurecauses.header.description', { defaultValue: 'Description' });

        const columns = [
            JTable.column(100, nameLabel),
            JTable.column(100, categoriesLabel),
            JTable.column(400, valueLabel),
        ];

        const failureCausesRendered = this.failureCauses
            .map(failureCause => {
                let name = failureCause.name;
                let categories = failureCause.categories.join(", ");
                let description = failureCause.description;
                return (
                    <TableRow key={name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{categories}</TableCell>
                        <TableCell>{description}</TableCell>
                    </TableRow>
                );
            });

        return (
            <div>
                <JTable columns={columns} className="failure-causes-table">
                    <TableHeaderRow />
                    {failureCausesRendered}
                </JTable>
            </div>
        );
    }
}

export default class RunDetailsFailureCausesLink extends ComponentLink {
    name = 'FailureCauses';
    title = t('rundetail.header.tab.failurecauses', { defaultValue: 'Failure Causes' });
    component = RunDetailsFailureCauses;
}