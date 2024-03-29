import { toast } from "react-toastify";

 export function onDeleteSuccess(message) {
     console.log(message);
     toast(message);
 }

 export function cellToAxiosParamsDelete(cell) {
     return {
         url: "/api/schools/delete",
         method: "DELETE",
         params: {
             abbrev: cell.row.values.abbrev  //fixme was id, is now abbrev?
         }
     }
}