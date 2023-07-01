$(document).ready(function (){

    $("#search .onclick").click(function(){
      if(!$(this).hasClass("active")){
          $(this).addClass("active");
      }
      else{
          $(this).removeClass("active");
      }          
      $(".show-search").animate({
        width: "toggle"
      });
    });
    $(".btn_menu").click(function(){
        if(!$(this).hasClass("active")){
            $(this).addClass("active");
            $(this).next('.menu_main').slideDown();
        }
        else{
            $(this).removeClass("active");
            $(this).next('.menu_main').slideUp();
        }   
    });
    if(screen.width <= 999)
    {
        $(".menu_main").find("a").click(function(){
            $('.btn_menu ').removeClass("active");
            $('.menu_main').slideUp();
        });
    }

    $(".warp_drown .input").find("a").click(function () {
        $(".warp_drown .input").hide(); 
        $(".warp_drown .output").removeClass("active");
        var html = $(this).html();
        $( ".warp_drown .output a" ).html(html);       
    }); 
    $(".warp_drown").find(".output").click(function(){
        if(!$(this).hasClass("active")){
            $(this).addClass("active");
            $(this).next('.input').show();
        }
        else{
            $(this).removeClass("active");
            $(this).next('.input').hide();
        }
    }); 
  
    
    // sticky navbar
    window.onscroll = function() {myFunction()};                                
    function myFunction() {                 
      var navbar_sticky = document.getElementById("navbar_sticky");
      var navbar = document.getElementById("nav-bar");
      var sticky = navbar_sticky.offsetTop; 
      // console.log(sticky);
      // if (window.pageYOffset >= sticky) {
      //   navbar.classList.add("sticky")
      // } else {
      //   navbar.classList.remove("sticky");                  
      // }
    }

    var lastId,
    topMenu = $(".menu_main"),
    topMenuHeight = topMenu.outerHeight()+0,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });
    menuItems.click(function(e){
      var href = $(this).attr("href"),
          offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
      $('html, body').stop().animate({ 
          scrollTop: offsetTop
      }, 300);
      e.preventDefault();
    });
    // Bind to scroll
    $(window).scroll(function(){
       // Get container scroll position
       var fromTop = $(this).scrollTop()+topMenuHeight+66;
       
       // Get id of current scroll item
       var cur = scrollItems.map(function(){
         if ($(this).offset().top < fromTop)
           return this;
       });
       // Get the id of the current element
       cur = cur[cur.length-1];
       var id = cur && cur.length ? cur[0].id : "";
       
       if (lastId !== id) {
           lastId = id;
           // Set/remove active class
           menuItems
             .parent().removeClass("active")
             .end().filter("[href='#"+id+"']").parent().addClass("active");
       }                   
    });


    /*OPEN & CLOSE MAIN MENU*/
    $(function(){
        $('.btn_control_menu').click(function(){
        $('body').addClass('show_main_menu');
        });

            $('.close_main_menu, .mask-content').click(function(){
            $('body').removeClass('show_main_menu');
        });
    })
    /*END OPEN & CLOSE MAIN MENU*/

	/**BUTTON BACK TO TOP**/
	$(window).scroll(function() {
	  if($(window).scrollTop() >= 200)
	  {
	    $('#to_top').fadeIn();
	  }
	  else
	  {
	    $('#to_top').fadeOut();
	  }
	});

	$("#to_top,.on_top").click(function() {
	  $("html, body").animate({ scrollTop: 0 });
	  return false;
	});
	/**END BUTTON BACK TO TOP**/


    $('.block_search .input_form').click(function(){
        $('.block_search').addClass('focus');
    });
     $('.block_search .btn_reset').click(function(){
        $('.block_search').removeClass('focus');
    });       
});