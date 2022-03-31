import React, { Component, PropTypes } from 'react';
import { PlaceholderTable } from '@jenkins-cd/design-language';

const PlaceholderDialog = props => {
    const { style, title, width } = props

    // See Icon 'AlertErrorOutline' from blueocean-material-icons
    const errorIcon = (
        <svg width="70" height="70" viewBox="-5 -5 35 35" xmlns="http://www.w3.org/2000/svg" class="icon">
            <g fill="none" fillRule="evenodd">
                <path
                    d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                    fill="#4A4A4A"
                    fillRule="nonzero"
                />
            </g>
        </svg>
    );

    return (
        <div className="PlaceholderDialog" style={{ ...style, width }}>
            {errorIcon}
            <h1 className="title">{title}</h1>
        </div>
    );
}

PlaceholderDialog.propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    width: PropTypes.number,
};

export default class NoFailureCausesPlaceholder extends Component {
    propTypes = {
        t: PropTypes.func,
    };

    render() {
        const { t } = this.props;

        const columns = [
            { width: 100, isFlexible: true, head: { text: 40 }, cell: { text: 150 } },
            { width: 500, head: { text: 50 }, cell: { text: 60 } },
        ];

        const title = t('rundetail.bfa.placeholder.title', { defaultValue: 'There are no identified failure causes for this run' });

        return (
            <div className="RunDetailsEmpty NoFailureCauses">
                <PlaceholderTable columns={columns} />
                <PlaceholderDialog width={265} title={title} />
            </div>
        );
    }
}
