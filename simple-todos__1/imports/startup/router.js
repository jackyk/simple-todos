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


let taskGroup =FlowRouter.group({
    prefix:'/tasks',
    triggersEnter:[isUserLoggedIn]
})

taskGroup.route('/',{
    // triggersEnter:[isUserLoggedIn],
    action:function(){
        BlazeLayout.render('App_Body',
        {main:'Landing_page'})
    }
});


taskGroup.route('/edit/:taskId',{
    action:function(params,queryParams){
        var taskId = FlowRouter.getParam('taskId');
        BlazeLayout.render('App_Body',
        {main:'Edit_task_page', taskId:taskId}
        );
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
