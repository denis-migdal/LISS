const WF = require("./build/WebpackFramework");

module.exports = async (env, args) => await WF.buildConfigs(env, args);