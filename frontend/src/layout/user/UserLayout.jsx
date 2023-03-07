import React from "react";

export function AdminLayout(props) {
    const {children} = props;

    return (
        <>       
        <div>Se esta usando el AdminLayout</div>
        {children}
        </>
    )
}