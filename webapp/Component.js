sap.ui.define(
    [
        "sap/ui/core/UIComponent"
    ],
    function (UIComponent) {
        return UIComponent.extend("ats.mm.product.Component", {
            metadata: {
                manifest: "json"
            },
            init: function (){
                //we want to call the constructor of the parent class
                //so we can get property, gold, diamond from papa
                UIComponent.prototype.init.apply(this);
                //the benefit of this is to get some extra functionality
                //like routing, models, etc. from parent class
                var oRouter = this.getRouter();
                //get the router object from the parent class
                //oRouter is an instance of sap.ui.core.routing.Router class
                //we can use this oRouter to navigate between views
                //we can use this oRouter to navigate between views

                ///initialize the router - it will scan your manifest.json file
                ///look upon routing config
                oRouter.initialize();
            },
            // createContent: function (){
            //     //Create the root view object here
            //     var oView = new sap.ui.view({
            //         id: "idRootView",
            //         viewName: "ats.mm.product.view.App",
            //         type: "XML"
            //     });

            //     //Create our view1 object
            //     var oView1 = new sap.ui.view({
            //         id: "idView1",
            //         viewName: "ats.mm.product.view.View1",
            //         type: "XML"
            //     });

            //     //Create view2 object
            //     var oView2 = new sap.ui.view({
            //         id: "idView2",
            //         viewName: "ats.mm.product.view.View2",
            //         type: "XML"
            //     });

            //     //Create Empty view object
            //     var oEmpty = new sap.ui.view({
            //         id: "idEmpty",
            //         viewName: "ats.mm.product.view.Empty",
            //         type: "XML"
            //     });

            //     //Embed view1 and view2 into the root view > CONTAINER Control
            //     //get the object of app container control whoes id is appCon
            //     var oAppCon = oView.byId("appCon");
            //     //add view1 and view2 to the app container control
            //     //my views view1 and view2 are now embedded as children of app container control

            //     oAppCon.addMasterPage(oView1);
                
            //     oAppCon.addDetailPage(oEmpty);
            //     oAppCon.addDetailPage(oView2);
                

            //     return oView;
            // },
            destroy: function (){}
        });
    }
);