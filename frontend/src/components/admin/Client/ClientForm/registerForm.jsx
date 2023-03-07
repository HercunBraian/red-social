import * as Yup from "yup";

export function initialValues () {
    return{
        name: "",
        email: "", 
        direccion: "",
        phone: "",
    };
};

export function validationSchema(){
    return Yup.object({
        email: Yup.string().email("El email no es valido").required("Campo obligatorio"),
        direccion: Yup.string().required("Campo obligatorio"),
        name: Yup.string().required("Campo obligatorio"),
        phone: Yup.number().required("Campo obligatorio"),
    })
}