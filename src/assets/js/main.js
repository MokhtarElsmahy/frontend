function hijriDate()
{
  //hijriDate
  var hijriDate = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(Date.now());
  var ex = hijriDate.includes('هـ');
  if (ex) {
    document.getElementById('date').innerHTML = hijriDate;
  } else {
    document.getElementById('date').innerHTML = hijriDate + ' هـ';
  }
  ;
}


function sliderhome()
{
  setTimeout(function () {
    $(".regular").slick({
      dots: false,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      rtl: true,
      arrows: true,
      prevArrow: '<span class="prev"><i class="far fa-arrow-alt-circle-left"></i></span>',
      nextArrow: '<span class="next"><i class="far fa-arrow-alt-circle-right"></i></span>',
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,

          }
        }
      ]


    });
  }, 2)
}

function welcomeSlider()
{

  setTimeout(function () {
    $(".variable").slick({
      dots: false,
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      centerMode: true,
      rtl: true,

      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            arrows: false,
          }
        }
      ]


    });
  }, 2);

}

function slidernews()
{
  setTimeout(function () {
    $('.slider-single').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      adaptiveHeight: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 4000,
      useTransform: true,
      speed: 600,
      cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)',
    });

    $('.slider-nav')
      .on('init', function (event, slick) {
        $('.slider-nav .slick-slide.slick-current').addClass('is-active');
      })
      .slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        dots: false,
        focusOnSelect: true,
        infinite: true,
        centerPadding: 0,
        arrows: false
      });


    $('.slider-single').on('afterChange', function (event, slick, currentSlide) {
      $('.slider-nav').slick('slickGoTo', currentSlide);
      var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
      $('.slider-nav .slick-slide.is-active').removeClass('is-active');
      $(currrentNavSlideElem).addClass('is-active');
    });

    $('.slider-nav').on('click', '.slick-slide', function (event) {
      event.preventDefault();
      var goToSingleSlide = $(this).data('slick-index');

      $('.slider-single').slick('slickGoTo', goToSingleSlide);
    });


  }, 10);
}


function sidebar(){
  !function(e, s, i) {
    "use strict";
    i(s).ready(function() {
      function a(e, s) {

          e.children(".submenu-content").show().slideUp(200, function() {
              i(this).css("display", ""), i(this).find(".menu-item").removeClass("is-shown"), e.removeClass("open"), s && s()
          })
      }
   
      var n = i(".app-sidebar"),
          t = i(".sidebar-content"),
          l = i(".wrapper"),
          o = s.querySelector(".sidebar-content");
     
      t.on("click", ".navigation-main .nav-item a", function() {
          var e = i(this).parent(".nav-item");
          if (e.hasClass("has-sub") && e.hasClass("open")) a(e);
          else {
              if (e.hasClass("has-sub") && function(e, s) {
                      var a = e.children(".submenu-content"),
                          n = a.children(".menu-item").addClass("is-hidden");
                      e.addClass("open"), a.hide().slideDown(200, function() {
                          i(this).css("display", ""), s && s()
                      }), setTimeout(function() {
                          n.addClass("is-shown"), n.removeClass("is-hidden")
                      }, 0)
                  }(e), t.data("collapsible")) return !1;
              a(e.siblings(".open")), e.siblings(".open").find(".nav-item.open").removeClass("open")
          }
      }), i(".nav-toggle").on("click", function() {
          var e = i(this).find(".toggle-icon");
          "expanded" === e.attr("data-toggle") ? (l.removeClass("nav-collapsed"), i(".nav-toggle").find(".toggle-icon").removeClass("fa-angle-left").addClass("fa-angle-right"), e.attr("data-toggle", "collapsed")) : (l.addClass("nav-collapsed menu-collapsed"), i(".nav-toggle").find(".toggle-icon").removeClass("fa-angle-right").addClass("fa-angle-left"), e.attr("data-toggle", "expanded"))

      }), n.on("mouseenter", function() {
          if (l.hasClass("nav-collapsed")) {
              l.removeClass("menu-collapsed");
              var e = i(".navigation-main .nav-item.nav-collapsed-open");
             /*  e.children(".submenu-content").hide().slideDown(300, function() {
                  i(this).css("display", "")
              }), t.find(".nav-item.active").parents(".nav-item").addClass("open"), e.addClass("open").removeClass("nav-collapsed-open") */
          }
      }).on("mouseleave", function(e) {
          if (l.hasClass("nav-collapsed")) {
              l.addClass("menu-collapsed");
              var s = i(".navigation-main .nav-item.open"),
                  a = s.children(".submenu-content");
              s.addClass("nav-collapsed-open"), a.show().slideUp(300, function() {
                  i(this).css("display", "")
              }), s.removeClass("open")
          }
      }), i(e).width() < 992 && (n.addClass("hide-sidebar"), l.removeClass("nav-collapsed menu-collapsed")), i(e).resize(function() {
          i(e).width() < 992 && (n.addClass("hide-sidebar"), l.removeClass("nav-collapsed menu-collapsed")), i(e).width() > 992 && (n.removeClass("hide-sidebar"), "collapsed" === i(".toggle-icon").attr("data-toggle") && l.not(".nav-collapsed menu-collapsed") && l.addClass("nav-collapsed menu-collapsed"))
      }), i(s).on("click", ".navigation li:not(.has-sub)", function() {
          i(e).width() < 992 && n.addClass("hide-sidebar")
      }), i(s).on("click", ".logo-text", function() {
          i(e).width() < 992 && n.addClass("hide-sidebar")
      }), i(".mobile-nav-toggle").on("click", function(e) {
          e.stopPropagation(), n.toggleClass("hide-sidebar")
      }), i("html").on("click", function(s) {
          i(e).width() < 992 && (n.hasClass("hide-sidebar") || 0 !== n.has(s.target).length || n.addClass("hide-sidebar"))
      }), i("#sidebarClose").on("click", function() {
          n.addClass("hide-sidebar")}),
     
        $(".right-sidebar-toggle").on("click",function(e) {
            this.classList.toggle('active');
            $('.wrapper').toggleClass('right-sidebar-expand');
            return false;
        });

      
    })

}
(window, document, jQuery);

  }

 