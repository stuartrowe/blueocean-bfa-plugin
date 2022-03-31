# Blue Ocean Build Failure Analyzer Plugin

This plugin provides Blue Ocean visualization for the [Build Failure Analzyer Plugin](https://github.com/jenkinsci/build-failure-analyzer-plugin).

# Building

```
mvn install
```

# Running

This requires 2 terminals. To run the plugin:

```
mvn hpi:run
```

... and to recompile the javascript as you update it:

```
node/npm run bundle:watch
```
