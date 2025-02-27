import buildConfigs from "./build/WebpackFramework/index.js";

export default buildConfigs("./V3/",
                            "./dist/${version}/V3/",
                            { "@LISS": "V3/" });