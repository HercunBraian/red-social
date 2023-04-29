import * as Yup from "yup";

export function initialValues () {
    return{
        client: "",
        name: "", 
        model: "",
        serial: "",
        version: "",
        ubi: ""
    };
};

export function validationSchema(){
    return Yup.object({
        client: Yup.string().required("Campo obligatorio"),
        name: Yup.string().required("Campo obligatorio"),
        model: Yup.string().required("Campo obligatorio"),
        serial: Yup.string().required("Campo obligatorio"),
        ubi: Yup.string().required("Campo obligatorio"),
        version: Yup.number().required("Campo obligatorio"),
    })
}