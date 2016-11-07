import React from 'react';

const address_search = ({ input, label, type, meta: {  touched, error } }) => (
    <div>
         <input {...input} className="SignUp-Input" placeholder={label} onChange={input.onChange} type={type}/>
    </div>
)

export default address_search