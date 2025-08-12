sap.ui.define(
    ["sap/ui/core/mvc/Controller",
     "ats/mm/product/util/formatter"
    ],
    function (Controller, Formatter) {
        return Controller.extend("ats.mm.product.controller.BaseController", {
            formatter: Formatter
            // here we can define some common methods which will be used in all controllers
        });
    }
)