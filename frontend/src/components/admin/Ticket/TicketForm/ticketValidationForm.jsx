import * as Yup from "yup";

export function initialValues (ticketId) {
  return {
    client: ticketId?.client.name || null,
    title: ticketId?.title || "", 
    obs: ticketId?.obs || "",
    priority: ticketId?.priority || "",
    department: ticketId?.department || "",
  };
};

export function validationSchema(){
    return Yup.object({
        client: Yup.string().required("Campo obligatorio"),
        title: Yup.string().required("Campo obligatorio"),
        obs: Yup.string().required("Campo obligatorio"),
        priority: Yup.string().required("Campo obligatorio"),
        department: Yup.string().required("Campo obligatorio"),
    })
}