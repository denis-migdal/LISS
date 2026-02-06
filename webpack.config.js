import buildConfigs from "./build/WebpackFramework/index.js";

export default buildConfigs("./src/", "./dist/${version}/",
                            {
                                "@LISS": "src/",
                                "@MWL" : "libs/MWL/src/",
                            });