sap.ui.define(
    ["ats/mm/product/controller/BaseController",
     "sap/m/MessageBox",
     "sap/m/MessageToast",
     "sap/ui/core/Fragment",
     "sap/ui/model/FilterOperator",
     "sap/ui/model/Filter",
     "sap/ui/model/json/JSONModel"
    ], 
    function (BaseController, MessageBox, MessageToast, Fragment, FilterOperator, Filter, JSONModel) {
        return BaseController.extend("ats.mm.product.controller.Add", {
            onInit: function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                //we have to explicitly pass the object of the controller class
                this.oRouter.getRoute("drstrange").attachMatched(this.herculis, this)
                //Create a local model to hold payload
                this.oLocalModel = new JSONModel({
                    "prodData": {
                                        "PRODUCT_ID": "",
                                        "TYPE_CODE": "PR",
                                        "CATEGORY": "Notebooks",
                                        "NAME": "",
                                        "DESCRIPTION": "",
                                        "SUPPLIER_ID": "0100000072",
                                        "SUPPLIER_NAME": "Vente Et Réparation de Ordinateur",
                                        "MEASURE_UNIT": "EA",
                                        "PRICE": "0.00",
                                        "CURRENCY_CODE": "EUR",
                                        "DIM_UNIT": "CM"
                                }
                });
                this.getView().setModel(this.oLocalModel,"local");
            },
            //In the herculis function, we cannot access 'this' pointer as the object of the controller
            //To get the object of Controller in this pointer, we need to pass it explicitly
            herculis: function(oEvent){
                //here we can get the view2 object
                var oAdd = this.getView();
                
            },
            onDelete: function(){
                //Step 1: get the odata object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 2: perform delete
                var that = this;
                oDataModel.remove("/ProductSet('" + this.prodId +"')",{
                    success: function(){
                        //Step 3: on delete clear screen
                        MessageBox.confirm("Wow it got deleted");
                        that.onClear()
                    }
                })
            },
            oSupplierPopup: null,
            onPopupSelect: function(oEvent){
                //Step 1: get the selected item     
                var oSelectedItem = oEvent.getParameter("selectedItem");
                //Step 2 : get the title value from standard list item
                var sTitle = oSelectedItem.getTitle();
                //Step 2: Set the value to the field inside the table
                this.oField.setValue(sTitle);
            },
            onSupplierF4: function(oEvent){
                ///Take the object of the field on which F4 was pressed
                this.oField = oEvent.getSource();
                //So if the fragment object is not there, then create it
                //Else, just open
                //When in ABAP we have a PBO - IF lo_alv IS NOT BOUND
                if(!this.oSupplierPopup){
                    //load - is a promise
                    //Option 2: Create a local variable where you hold the controller object
                    var that = this;
                    Fragment.load({
                        id: 'supplier',
                        name: 'ats.mm.product.fragments.popup',
                        type: 'XML',
                        controller: this
                    })
                    //handle once the promise is fulfilled
                    .then(
                        //promise function
                        function(oFragment){
                            debugger;
                            //here we will not have access to controller object via this
                            //so to get the this variable as our controller object, we have to pass it
                            //We can access any local variable inside the event handler
                            that.oSupplierPopup = oFragment;
                            //Change the title
                            that.oSupplierPopup.setTitle("Choose Supplier");
                            //Now we bind the items aggregation of our popup
                            that.oSupplierPopup.bindAggregation("items",{
                                path: '/SupplierSet',
                                template: new sap.m.StandardListItem({
                                    description: '{COMPANY_NAME}, {CITY}',
                                    title: '{BP_ID}',
                                    icon: 'sap-icon://supplier'
                                })
                            });
                            //Allow the access of model (liver, heart) to fragment(parasite) through view (immune system)
                            that.getView().addDependent(that.oSupplierPopup);
                            that.oSupplierPopup.open();
                        }
                        //Option 1: .bind(this)
                        //in bind(this) we are explicitly passing the controller object to the promise function
                        //so inside the promise function 'this' pointer can access our controller object
                    );
                    
                }else{
                     this.oSupplierPopup.open();
                }
                //MessageBox.confirm("This functionality is under construction 👍");
                
            },
            onLoadExp: function(oEvent){
                //Step 1: get the odata model object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 2: make a call to function import
                var that = this;
                oDataModel.callFunction("/GetMostExpensiveProduct",{
                    urlParameters: {
                        "I_CATEGORY": that.getView().getModel("local").getProperty("/prodData/CATEGORY")
                    },
                    success: function(data){
                        that.getView().getModel("local").setProperty("/prodData",data);
                    }
                })
            },
            onClear: function(){
                this.oLocalModel.setProperty("/prodData",{
                                        "PRODUCT_ID": "",
                                        "TYPE_CODE": "PR",
                                        "CATEGORY": "Notebooks",
                                        "NAME": "",
                                        "DESCRIPTION": "",
                                        "SUPPLIER_ID": "0100000072",
                                        "SUPPLIER_NAME": "Vente Et Réparation de Ordinateur",
                                        "MEASURE_UNIT": "EA",
                                        "PRICE": "0.00",
                                        "CURRENCY_CODE": "EUR",
                                        "DIM_UNIT": "CM"
                                });
                this.setMode("Create");
            },  
            mode: "Create",
            setMode: function(sMode){
                if (sMode === "Create") {
                    this.getView().byId("idSave").setText("Save");
                    this.getView().byId("name").setEnabled(true);
                    this.getView().byId("idDelete").setEnabled(false);
                }else{
                    this.getView().byId("idSave").setText("Update");
                    this.getView().byId("name").setEnabled(false);
                    
                    this.getView().byId("idDelete").setEnabled(true);
                }
                this.mode = sMode;
            },
            onBack: function (){
                //TODO: Implement navigation to View1 
                //calling mother
                var oAppCon = this.getView().getParent();
                //navigate to view1
                oAppCon.to("idView1");
            },
            prodId: null,
            onSubmit: function(oEvent){
                //Step 1: Which product ID entered by user
                var sValue = oEvent.getParameter("value");
                //Step 2: Store this id globally so later we can also reuse it
                this.prodId = sValue;
                //Step 3: Get OData Model object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 4: Call GET SINGLE order data from OData 
                var that = this;
                oDataModel.read("/ProductSet('" + sValue + "')", {
                    success: function(data){
                        //Step 5: On Sucess: load local model so data shows on UI - because its 2 way binding
                        that.oLocalModel.setProperty("/prodData", data);
                        that.setMode("Update");
                    },
                    error: function(oError){
                        //Step 6: On Error : Show the error message
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                        that.setMode("Create");
                        that.onClear();
                    }
                });            

            },
            onSave: function (){
                //Step 1: get the payload of the data which needs to be sent to SAP 
                var payload = this.oLocalModel.getProperty("/prodData");
                //Step 2: validate the data, only once validation success, then we send to SAP
                if(!payload.PRODUCT_ID){
                    MessageBox.error("Bro, Please enter the product Id");
                    return "";
                }
                //Step 3: get Odata Model object to communicate to SAP S/4HANA
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 4: Make a POST call to SAP OData - https://ui5.sap.com/#/api/sap.ui.model.odata.v2.ODataModel%23methods/create
                var that = this;
                if (this.mode === "Create") {
                    oDataModel.create("/ProductSet", payload, {
                        //Step 5: Handle success callback and show success message
                        success: function(){
                            MessageToast.show("Wahalla! your data was saved success 🙏")
                        },
                        //Step 6: Thorw error to user
                        error: function(oError){
                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                        }
                    });     
                }else{
                    oDataModel.update("/ProductSet('" + this.prodId + "')", payload, {
                        //Step 5: Handle success callback and show success message
                        success: function(){
                            MessageToast.show("Wahalla! your data was updated successfully 🙏")
                            that.setMode("Create");
                            that.onClear();
                        },
                        //Step 6: Thorw error to user
                        error: function(oError){
                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                            that.setMode("Create");
                            that.onClear();                            
                        }
                    });  
                }
                
            }

        });
    }
);