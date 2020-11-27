const users = {
    hasPermission(...id){
        console.log("--",id);
        return true;

    },
    hasAccess(){
        return true;
    }

}

export default users