const { compile } = require("morgan");

const controller = {};

// function createItem() {
// 	localStorage.setItem('nameOfItem', 'value'); 
// } 
// createItem()

// controller.home = (req, res) => {
//     res.render('home', {});
//   }

// controller.home = (req, res) => {
//     req.getConnection((err, conn) => {
//         console.log("hello homepage");
//         res.render('home', {});
//     });
// };
controller.home = (req, res) => {
    req.getConnection((err, conn) => {
      conn.query('UPDATE users SET ISACTIVE = "N" WHERE ISACTIVE="Y"', (err) => {
          conn.query('UPDATE managers SET ISACTIVE = "N" WHERE ISACTIVE="Y"',(err2)=>{
            if (err) {
                res.json(err);
              }
            if(err2)
            {
                res.json(err2);
            }
              res.render('home', {
              });
          })
        
      });
    });
  }
//  SIGNUP
controller.signup = (req, res) => {
    console.log("hello signup page");
    res.render('signup', {});
};

// controller.adduser = (req, res) =>{
//    const data = req.body;
//    console.log(req.body);
   
//    req.getConnection((err, connection) => {
//        const query = connection.query('insert into users set ?' , data, (err, user) => {
//            console.log("outer query\n", user);
//         const query = connection.query('select user_id from users where name=? && password=?',[data.name,data.password] ,(err2,user_id)=>{
//             console.log(user_id[0].user_id);
//             const query = connection.query('insert into accounts (user_id) values(?)',[user_id[0].user_id],(err,result)=>{
//                 console.log(result);
//                 res.redirect('/');
//             })
           
//         })
       
//        })

       
//   })

// };
controller.adduser = (req, res) =>{
    const data = req.body;
    console.log(req.body);
    
    req.getConnection((err, connection) => {
        const query = connection.query('insert into users (name,password,email,fname,city,mob_number) values(?,?,?,?,?,?)' ,[data.name, data.password, data.email, data.fname, data.city, data.mob_number], (err, user) => {
            console.log(err);
            console.log("outer query\n", user);
         const query = connection.query('select user_id from users where name=? && password=?',[data.name,data.password] ,(err2,user_id)=>{
             console.log(user_id[0].user_id);
             const query = connection.query('insert into accounts (user_id) values(?)',[user_id[0].user_id],(err,result)=>{
                 console.log(result);
                 res.redirect('/');
             })
            
         })
        
        })
 
        
   })
 
 };
// LOGIN
controller.login = (req, res) => {
    console.log("hello login page");
    res.render('login', {});
};



//login individual

controller.loginuser = (req,res) => {
    const data = req.body;
    console.log("hello loginuser page");
    // res.render('login', {});

    req.getConnection((err, connection) =>{
        const query = connection.query('SELECT * FROM users WHERE name = ? && password = ?', [data.username, data.password],(err, user)=>{
            const query = connection.query('update users set isactive="Y" where name=? && password=?', [data.username, data.password], (err)=>{
               
                    console.log(user);
                    if(user.length == 0)
                    {
                        res.redirect('/login');
                    }
                    else{
                        res.redirect('/account_details');
                    }
                
               

            }) 
       })
       
    })
};

// Account display

controller.account_details = (req,res) => {
    // const data = req.user_info;
    console.log("inside account details");
    req.getConnection((err,connection) =>{

        const query = connection.query('select * from users where isactive = "Y" ',(err,data)=>{
            console.log("User data :\n",data)
            // console.log(data[0].name)
            const query = connection.query('select * from accounts where user_id= ?',(data[0].user_id),(err,data2)=>{
                // console.log("data 2 acc" , data2[0].account_no);
                const query = connection.query('select * from transactions where sender_acc_no = ?',[data2[0].account_no],(err_sender,sender_data3)=>{
                    // console.log(err_sender);
                    const query = connection.query('select * from transactions where reciever_acc_no = ?',[data2[0].account_no],(err,reciever_data4)=>{
                        // console.log("sender_data: ",sender_data3,"reciever_data",reciever_data4);   
                        res.render("account_details",{user_name : data[0].name,
                            user_account_number : data2[0].account_no,
                        user_balance:data2[0].balance,sender_table: sender_data3,reciever_table: reciever_data4, data:data[0]});
                    })
                })
               
            })
            
        })
    })
    
}

//account transaction details

controller.trans_history = (req,res) => {
    console.log("inside transaction table details");
    req.getConnection((err,connection) =>{

        const query = connection.query('select * from users where isactive = "Y" ',(err,data)=>{
            // console.log(data[0].name)
            const query = connection.query('select * from accounts where user_id= ?',(data[0].user_id),(err,data2)=>{
                console.log("data 2 acc" , data2[0].account_no);
                const query = connection.query('select * from transactions where sender_acc_no = ? order by trans_id desc',[data2[0].account_no],(err_sender,sender_data3)=>{
                    console.log(err_sender);
                    const query = connection.query('select * from transactions where reciever_acc_no = ? order by trans_id desc',[data2[0].account_no],(err,reciever_data4)=>{
                        console.log("sender_data: ",sender_data3,"reciever_data",reciever_data4);   
                        res.render("trans",{user_name : data[0].name,
                            user_account_number : data2[0].account_no,  
                        user_balance:data2[0].balance,sender_table: sender_data3,reciever_table: reciever_data4});
                    })
                })
               
            })
            
        })
    })
}

//Account addition
controller.add = (req, res) =>{
    res.render('addmoney', {});
}


controller.add_money = (req,res) => {
    const data = req.body;
    console.log(data.amount);
    req.getConnection((err, connection) =>{
        const query = connection.query('select * from users where isactive = "Y"',(err,data1)=>{
            console.log("data 1 (addition) : ", data1[0].user_id)
            const query = connection.query('update accounts set balance = balance + ? where user_id = ?',[data.amount,data1[0].user_id],(err,data3)=>{
                res.redirect('/account_details');
            })
        } )
    })
}

// Account Subtraction
controller.sub = (req, res) =>{
    res.render('submoney', {})
}


controller.sub_money = (req,res) => {
    const data = req.body;
    console.log(data.amount);
    req.getConnection((err,connection) => {
        const query = connection.query('select * from users where isactive = "Y"',(err,data1)=>{
            console.log("data 1 (subtraction): ", data1[0].user_id);
            const query = connection.query('select balance from accounts where user_id = ?',[data1[0].user_id],(err,data2) =>{
                console.log("data 2 (subtraction) : ", data2[0].balance);
                if(data2[0].balance -500 >= data.amount)
                {
                    const query = connection.query('update accounts set balance = balance - ? where user_id = ?',[data.amount,data1[0].user_id],(err,data3) =>{
                        console.log("data 3 (subtraction) :" ,data3);
                        res.redirect("/account_details");
                    })
                }
                else{
                    res.redirect('/account_details');
                }
            } )
        })
    })
}

// transfer

controller.transfer = (req,res) => {
    req.getConnection((err,connection) =>{
        const query = connection.query('select * from users U join accounts A where U.isactive = "N" && U.user_id=A.user_id',(err,data)=>{
            console.log("join", data)
            res.render("transfer",{data : data});
            
        })
    })
}

controller.transfer_money = (req, res) =>{
    input = req.body;
    console.log("form details : ", input.radio_user_id ,input.sender_amount);
    
    req.getConnection((err, connection)=>{
        const query = connection.query('select * from users U join accounts A where U.isactive = "Y" && U.user_id=A.user_id ',(err,data)=>{
            console.log( "sender_balance : " ,data);
            if(input.sender_amount  <= data[0].balance - 500)
            {
                    console.log("success");
                   const query = connection.query('insert into transactions (sender_acc_no,reciever_acc_no,amount,status) values (?,?,?,?)',
                   [data[0].account_no,input.radio_user_id,input.sender_amount,"S"],(err,data2) => {
                       console.log("successfull transaction",err,data2);
                        res.redirect('/account_details');
                   })

            }
            else{
                console.log("fail");
                const query = connection.query('insert into transactions (sender_acc_no,reciever_acc_no,amount,status) values (?,?,?,?)',
                [data[0].account_no,input.radio_user_id,input.sender_amount,"F"],(err,data2) => {
                    console.log("Task Failed Succesfully",err,data2);
                     res.redirect('/account_details');
                })
            }
            
        })
    })
}

// loans

// managers

controller.login_manager = (req, res) =>{
    res.render('manager_login', {});
}

controller.loginManager = (req, res) =>{
    const data = req.body;
    console.log("hello manager login  page");
    // res.render('login', {});

    req.getConnection((err, connection) =>{
        const query = connection.query('SELECT * FROM managers WHERE name = ? && password = ?', [data.username, data.password],(err, user)=>{
            const query = connection.query('update managers set isactive="Y" where name=? && password=?', [data.username, data.password], (err)=>{
               
                    console.log(user);
                    if(user.length == 0)
                    {   console.log("oops");
                        res.redirect('/login_manager');
                    }
                    else{
                        // res.redirect('/manager_details');
                        console.log("manager logged in");

                        res.redirect('/manager_details');
                        
                    }
                
               

            }) 
       })
       
    })
}

// manager Details

controller.manager_details = (req, res) => {
    console.log("manager details");
    // req.getConnection((err,connection) =>{
    //     const query = connection.query('select * from transactions',(err,transactions)=>{
    //         console.log("transactions",transactions);
    //         const query = connection.query('select * from users',(err2,users_details)=>{
    //             console.log("users_details",users_details);
    //             res.render('manager_details',{transactions:transactions,users:users_details});
    //         })
    //     })
    // })
    req.getConnection((err, connection)=>{
        const query = connection.query('select * from managers where isactive="Y"',(err,manager)=>{
            const query = connection.query('select * from loans L join users U on L.from_user = U.user_id where L.status="pending"',(err1,loans)=>{
                res.render('manager_details',{data : manager[0],loans:loans});
            })
            
        })
    })
    
    
    
}

controller.manager_see_users = (req,res) => {
    req.getConnection((err,connection) =>{
        const query = connection.query('select * from users U join accounts A where U.user_id = A.user_id',(err,users)=>{
            console.log("users",users);
            res.render('manager_see_users',{users:users})
        })
    })
}

controller.manager_see_transactions = (req,res) => {
    req.getConnection((err,connection) =>{
        const query = connection.query('select * from transactions',(err,transactions)=>{
            console.log("transactions",transactions);
            res.render('manager_see_transactions',{transactions:transactions})
        })
    })
}

// loans
controller.loans = (req, res) =>{
    res.render('loans',{});
}

controller.apply_loan = (req,res) =>{
    console.log(req.body);
    req.getConnection((err,connection)=>{
        const query = connection.query('select * from users where isactive="Y"',(err,user)=>{
            console.log("user vali query : ",err,user);
            const query = connection.query ('select * from accounts where user_id=?',[user[0].user_id],(err1,account)=>{
                console.log('account vali query: ',err1,account);
                const query = connection.query('insert into loans (from_user,acc_no,amount) values (?,?,?)',[user[0].user_id,account[0].account_no,req.body.amount],(err2,data)=>{
                    console.log("loans row entered: ", data);
                    res.redirect('/account_details');   
                })
            })
        })
    })
    
    // 
}

controller.loan_details = (req,res) => {
    req.getConnection((err,connection)=>{
        const query = connection.query('select * from users where isactive="Y"',(err,user)=>{
            console.log('user: ',user[0]);
            const query = connection.query('select * from loans where from_user = ? order by loan_id desc',[user[0].user_id],(err1,loan)=>{
                console.log("loan: ", loan)
                res.render('loan_details',{loan:loan});
            })
        })
    })
}

controller.loan_accept = (req,res)=>{
    console.log(req.params.loan_id)
    // update loans -> set status = S
    req.getConnection((err,connection)=>{
        const query = connection.query('update loans set status = "S" where loan_id = ?',[req.params.loan_id],(err,result)=>{
            console.log("loan - accept: ",err,result);
            res.redirect('/manager_details');
        })
    })
}

controller.loan_reject = (req,res)=>{
    console.log(req.params.loan_id)
    // update loans -> set status = F
    req.getConnection((err, connection)=>{
        const query = connection.query('update loans set status = "F" where loan_id = ?',[req.params.loan_id],(err,result)=>{
            console.log("loan - reject: ",err,result);
            res.redirect("/manager_details");
        } )
    })
}

module.exports = controller;