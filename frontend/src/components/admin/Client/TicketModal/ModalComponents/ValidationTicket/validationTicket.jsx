import * as Yup from "yup";

export function initialValues (ticketId) {
  return {
    diagnostic: ticketId?.diagnostic || "",
  };
};

export function validationSchema(){
    return Yup.object({
      diagnostic: Yup.string().required("Campo obligatorio"),
    })
}