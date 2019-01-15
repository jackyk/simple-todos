FlowRouter.route('/',{
    action:function(){
        // if(Meteor.userId()){
        //     // if logged in
// This should load as the firstpage
           BlazeLayout.render('App_Body',
            {main:'Prompt_page'
        });
    // }
    // else{
    //     BlazeLayout.render('App_Body',
    //         {main:'Prompt_page'
    //     });
    //     }
    }

});

FlowRouter.route('/tasks',{
    triggersEnter:[isUserLoggedIn],
    action:function(){
        BlazeLayout.render('App_Body',
        {main:'Landing_page'})
    }
});

FlowRouter.route('/logout',{
    action:function(){
        Meteor.logout(function(){
            FlowRouter.go('/')
        });
    }
});

function isUserLoggedIn(context){
    // this checks the route that is in 
    // account-config and calls it here to confirm is not logged it does not open
    // console.log(context);
    // return function(){
        if ( Meteor.userId()){
            route = FlowRouter.current();
            }else{
                    FlowRouter.go('/');
                }
            }
        // }
    // }
