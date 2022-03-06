import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    state = {
        username: "",
        pwd: ""
    };

    handleChange = e =>{
        const target = e.target
        const value = target.value
        const name = target.name
        this.setState({[name]:value})
    };

    handelClick = e =>{
        //hard code database
        const user_date = [
            {
                username:"user1",
                password:"user1"
            },
            {
                username:"user2",
                password:"user2"
            }
        ];

        //check existence of username
        const checkExist = user_date.find((user)=>user.username===this.state.username);

        if(!checkExist){
            console.log("user does not exist")
            this.setState({
                error:true
            })
        }else{
            if(checkExist.password !== this.state.password){
                console.log("wrong password")
                this.setState({
                    error:true
                })
            }
        }
    }
    

    render() {
        return (
            <React.Fragment>
                <div className="login">
                    <div className="login_banner">
                        <p>Recipe...</p>
                    </div>
                    <div><h1>Log-in</h1></div>
                    <div className="form-inputs">
                        <form>
                            <input
                                type="username"
                                name="username"
                                placeholder="username..."
                                required
                            />
                        </form>
                        <form>
                            <input
                                type="password"
                                name="pwd"
                                placeholder="password..."
                                required
                            />
                        </form>
                    </div>
                    <div>
                        <Link to={"/home"}>
                            <button>LOGIN</button>
                        </Link>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Login;


// check if user name exist

// check passwords
