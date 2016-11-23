const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = '이름을 입력하세요.';
        console.log("1");
    }
    if (!values.password) {
        errors.password = '비밀번호를 입력하세요.';
        console.log("2");
    }
    else if(!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(values.password)){
        errors.password = '*특수문자 1개이상 포함 6~20자리를 입력해주세요.';
        console.log("3");
    }
    if(!values.passwordconfirm){
        errors.passwordconfirm="비밀번호를 다시 입력하세요";
        console.log("4");
    }
    if(values.password!=values.passwordconfirm){
        errors.passwordconfirm="비밀번호 불일치.";
        console.log("5");
    }
    // if (!values.firstName) {
    //     errors.firstName = 'Required'
    // }
    // if (!values.lastName) {
    //     errors.lastName = 'Required'
    // }
    if (!values.email) {
        errors.email = '이메일을 입력하세요.'
    }
    else if (!/^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(values.email)) {
        errors.email = '이메일 형식에 맞게 입력하세요.';
        console.log("6");
    }


    // console.log("zzzz"+values.age);
    // if (!values.address) {
    //     errors.address = '*위치기반 추천을 위해 최소 \'동\'까지 입력'
    // }

    console.log(values);
    console.log(errors);
    return errors
};

export default validate