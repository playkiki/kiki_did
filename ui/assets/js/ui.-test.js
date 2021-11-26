$(document).ready(function () {

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  $(function () {
    $('[data-toggle="popover"]').popover()
  });

  $("#searchBarTrigger").click(function () {
    $("#searchBarTrigger > .fa-search").toggle();
    $("#searchBarTrigger > .fa-times").toggle();
  });


  $(".btn-delete").hover(function () {
    $(this).children(".delete").fadeIn(100);
  },
    function () {
      $(this).children(".delete").fadeOut(40);
    }
  );

  $(".btn-delete > .delete").hover(function () {
    $(this).parent(".btn-delete").children(".btn-type").css("opacity", "0.5");
  },
    function () {
      $(this).parent(".btn-delete").children(".btn-type").css("opacity", "1");
    }
  );

  $(".btn-delete > .delete").click(function () {
    $(this).parent(".btn-delete").fadeOut(200);
  });

  $("#productFilter #productFilterTexture .btn , #productFilter .btn-color").click(function () {
    $("#collapseFilter").collapse('show');
  });

  // texture button 관련 이벤트
  $("#textureBtns button").each(function (index) {
    $(this).click({ index: index }, function (event) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#collapseFilterTexture .btn-delete").eq(event.data.index).fadeOut();
      } else {
        $(this).addClass("active");
        $("#collapseFilterTexture .btn-delete").eq(event.data.index).fadeIn();
      }
    });
  })
  $("#collapseFilterTexture .btn-delete").each(function (index) {
    $(this).click({ index: index }, function (event) {
      $("#textureBtns button").eq(event.data.index).click();
    });
  })

  // color button 관련 이벤트
  $("#colorBtns button").each(function (index) {
    $(this).click({ index: index }, function (event) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#collapseFilterColor .btn-delete").eq(event.data.index).fadeOut();
      } else {
        $(this).addClass("active");
        $("#collapseFilterColor .btn-delete").eq(event.data.index).fadeIn();
      }
    });
  })
  $("#collapseFilterColor .btn-delete").each(function (index) {
    $(this).click({ index: index }, function (event) {
      $("#colorBtns button").eq(event.data.index).click();
    });
  })

  $("#popUp .close").click(function () {
    $("#popUp").fadeOut(200);
  });

  $(".favorite").click(function () {
    $(this).children("i.fa-heart").toggleClass("fas");
    $(this).children("i.fa-heart").toggleClass("far");
  });

  $("#accordionQna .btn-qna-edit").click(function () {
    $(this).text(function (_i, text) {
      return text === "내용 수정" ? "취소" : "내용 수정";
    })
    $(this).parent(".col-lg-2").parent(".row").children(".col-lg-10").children(".qna-concern").toggle(0);
    $(this).parent(".col-lg-2").parent(".row").children(".col-lg-10").children(".qna-concern-edit").toggle(0);

  });

  // main carousel thumbnail indicator
   $('#carouselMain').on('slide.bs.carousel', function () {
     var carouselItemIndex = $(this).find('.carousel-item.active').index();
     var isHover = $('#slide1_detail').is(":hover");

     //슬라이드가 일어나기 전 idx , 일어난 이후에는 +1을 해야한다.
     var nextIdx = parseInt(carouselItemIndex)+1;
     // 슬라이드가 마지막이라면 3, 3일때는 +1이 아닌 0으로 돌아간다.
     if(nextIdx == 4){
      nextIdx=0;
     }

     //#slide_detail에서 hover된 element에 클릭이 일어났다면 해당 index를 적용시킨다.
     if(isHover == true){
       var nextIdx = $('#slide1_detail').find('li:hover').index();
     }

     setActive("#slide1_detail",nextIdx);
   });
   
   function setActive(element,idx){
      var target = $(element);
      target.find("li").removeClass("active");
      target.find("li:eq("+idx+")").addClass('active');
   }
  
  //main carousel 부트스트랩 소스 코드
  /*_proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
     if (this._indicatorsElement) {
       var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector.ACTIVE));
       $(indicators).removeClass(ClassName.ACTIVE);

       var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

       if (nextIndicator) {
         $(nextIndicator).addClass(ClassName.ACTIVE);
       }
     }
  };*/

  // 쇼핑 히스토리 스크롤 이벤트
  var floatPosition = parseInt($("#recentlyViewed").css('top'));
   $(window).scroll(function () {
     var scrollTop = $(window).scrollTop();
     var winHeight = $(window).height();
     var newPosition = scrollTop + floatPosition - winHeight + "px";
     $("#recentlyViewed").stop().animate({
       "top": newPosition
     }, 400);
   }).scroll();

  // Bootstrap file input 
  // bsCustomFileInput.init();

});