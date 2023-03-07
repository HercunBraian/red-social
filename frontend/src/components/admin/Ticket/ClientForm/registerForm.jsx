import * as Yup from "yup";

export function initialValues () {
    return{
        client: "",
        title: "", 
        obs: "",
        priority: "",
        department: "",
    };
};

export function validationSchema(){
    return Yup.object({
        client: Yup.string().required("Campo obligatorio"),
        title: Yup.string().required("Campo obligatorio"),
        obs: Yup.string().required("Campo obligatorio"),
        priority: Yup.number().required("Campo obligatorio"),
        department: Yup.string().required("Campo obligatorio"),
    })
}