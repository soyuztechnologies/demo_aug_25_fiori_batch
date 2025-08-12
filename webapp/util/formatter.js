sap.ui.define(
    [],
    function(){
        return {
            getStatus: function(code){
                switch (code) {
                    case 'A':
                        return 'Available';
                        break;
                    case 'D':
                        return 'Discontinued';
                        break;
                    case 'O':
                        return 'Out of Stock';
                        break;
                    default:
                        break;
                }
            },
            getStatusColor: function(code){
                switch (code) {
                    case 'A':
                        return 'Success';
                        break;
                    case 'D':
                        return 'Error';
                        break;
                    case 'O':
                        return 'Warning';
                        break;
                    default:
                        break;
                }
            }
        }
    }

)