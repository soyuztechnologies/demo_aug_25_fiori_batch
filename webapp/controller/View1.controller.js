sap.ui.define(
    ["ats/mm/product/controller/BaseController",
     "sap/m/MessageBox",
     "sap/m/MessageToast",
     "sap/ui/model/Filter",
     "sap/ui/model/FilterOperator"
    ], 
    function (BaseController, MessageBox, MessageToast, Filter, FilterOperator) {
        return BaseController.extend("ats.mm.product.controller.View1", {
            onInit: function () {
                //here we need router object - get it from our Component.js
                this.oRouter = this.getOwnerComponent().getRouter();
            },
            onNext: function (sIndex){
                //TODO: Implement navigation to View2 
                //calling mother -- split app view1 ==> masterSection ==> splitApp
                //var oAppCon = this.getView().getParent().getParent();
                //navigate to view2
                //oAppCon.toDetail("idView2");
                this.oRouter.navTo("spiderman",{
                    fruitId: sIndex
                });
            },
            onOrderNow: function(){
                MessageToast.show("Order placed successfully!");
            },
            onSearch: function(oEvent){
                //Step 1: here we will extract the query parameter
                var searchStr = oEvent.getParameter("query");
                //Step 2: construct the filter condition
                var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, searchStr);
                // var oFilter2 = new Filter("taste", FilterOperator.Contains, searchStr);
                // //Step 3: Put condition in an array
                // var aFilter = [oFilter1, oFilter2];
                // //Step: Now going to tell computer to use OR operator for filter
                // var oFilter = new Filter({
                //     filters: aFilter,
                //     and: false
                // });
                //Step 4: get the list control object
                var oList = this.getView().byId("idList");
                //Step 5: Inject the filter inside the binding of items to filter items
                oList.getBinding("items").filter(oFilter1);
            },
            onAdd: function(){
                this.oRouter.navTo("drstrange");
            },
            onItemPress: function(oEvent){
                //Step 1: get the object of the listItem on which user clicked
                var oListItem = oEvent.getParameter("listItem");
                //Extra: get the data of selected itema and print
                var sText = oListItem.getTitle();
                console.log(sText);
                //Step 2: Get the path of the element
                var sPath = oListItem.getBindingContextPath();
                console.log(sPath);
                //extract the index from path e.g. inp = /fruits/3 => ["fruits","3"] ==> 3
                var sIndex = sPath.split("/")[sPath.split("/").length - 1];
                //Step 3: get the object of V2
                //var oView2 = this.getView().getParent().getPage("idView2");
                //We are using Split App container control View1==>MasterSection==>SplitApp==>DetailSection==>View2
                //var oView2 = this.getView().getParent().getParent().getDetailPage("idView2");
                //Step 4: Element binding - compare with simpleForm receiving Element path from table row Select
                //oView2.bindElement(sPath)
                //Navigate to View2
                this.onNext(sIndex);
            },
            onDelete: function(oEvent){
                //Step 1: object of the item which needs to be deleted
                var oItemDelete = oEvent.getParameter("listItem");
                //Step 2: get the list object - better for id change - less maintenance
                var oList = oEvent.getSource();
                //Step 3: perform the delete
                oList.removeItem(oItemDelete);
            }


        });
    }
);

