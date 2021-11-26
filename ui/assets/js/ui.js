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
  $("#popUp2 .close").click(function () {
    $("#popUp2").fadeOut(200);
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

  $(".btn-check").click(function () {
    $(this).toggleClass("btn-gray2");
    $(this).toggleClass("btn-primary");
  });

  $(function () {
    $('#shippingCost').hide();
    $('#countrySelect').change(function () {
      if ($('#countrySelect').val() == '1') {
        $('#shippingCost').hide();
      } else {
        $('#shippingCost').fadeIn();
      }
    });
  });

  $("input[name=mapRadio]").on("change", function () {
    $(".mapDiv").hide();
    var test = $(this).val();
    $("#" + test).show();
  });


  $("#btnTextureAnimal").click(function () {
    $("#descritionTextureAnimal").addClass("d-flex");
    $("#descritionTextureAnimal").removeClass("d-none");

    $("#descritionTextureNatural").addClass("d-none");
    $("#descritionTexturePlain").addClass("d-none");
    $("#descritionTextureMesh").addClass("d-none");
    $("#descritionTextureSpecial").addClass("d-none");

    $("#descritionTextureNatural").removeClass("d-flex");
    $("#descritionTexturePlain").removeClass("d-flex");
    $("#descritionTextureMesh").removeClass("d-flex");
    $("#descritionTextureSpecial").removeClass("d-flex");
  });

  $("#btnTextureNatural").click(function () {
    $("#descritionTextureNatural").addClass("d-flex");
    $("#descritionTextureNatural").removeClass("d-none");

    $("#descritionTextureAnimal").addClass("d-none");
    $("#descritionTexturePlain").addClass("d-none");
    $("#descritionTextureMesh").addClass("d-none");
    $("#descritionTextureSpecial").addClass("d-none");

    $("#descritionTextureAnimal").removeClass("d-flex");
    $("#descritionTexturePlain").removeClass("d-flex");
    $("#descritionTextureMesh").removeClass("d-flex");
    $("#descritionTextureSpecial").removeClass("d-flex");
  });

  $("#btnTexturePlain").click(function () {
    $("#descritionTexturePlain").addClass("d-flex");
    $("#descritionTexturePlain").removeClass("d-none");

    $("#descritionTextureAnimal").addClass("d-none");
    $("#descritionTextureNatural").addClass("d-none");
    $("#descritionTextureMesh").addClass("d-none");
    $("#descritionTextureSpecial").addClass("d-none");

    $("#descritionTextureAnimal").removeClass("d-flex");
    $("#descritionTextureNatural").removeClass("d-flex");
    $("#descritionTextureMesh").removeClass("d-flex");
    $("#descritionTextureSpecial").removeClass("d-flex");
  });

  $("#btnTextureSpecial").click(function () {
    $("#descritionTextureSpecial").addClass("d-flex");
    $("#descritionTextureSpecial").removeClass("d-none");

    $("#descritionTextureAnimal").addClass("d-none");
    $("#descritionTextureNatural").addClass("d-none");
    $("#descritionTexturePlain").addClass("d-none");
    $("#descritionTextureMesh").addClass("d-none");

    $("#descritionTextureAnimal").removeClass("d-flex");
    $("#descritionTextureNatural").removeClass("d-flex");
    $("#descritionTexturePlain").removeClass("d-flex");
    $("#descritionTextureMesh").removeClass("d-flex");
  });

  $("#btnTextureMesh").click(function () {
    $("#descritionTextureMesh").addClass("d-flex");
    $("#descritionTextureMesh").removeClass("d-none");

    $("#descritionTextureAnimal").addClass("d-none");
    $("#descritionTextureNatural").addClass("d-none");
    $("#descritionTexturePlain").addClass("d-none");
    $("#descritionTextureSpecial").addClass("d-none");

    $("#descritionTextureAnimal").removeClass("d-flex");
    $("#descritionTextureNatural").removeClass("d-flex");
    $("#descritionTexturePlain").removeClass("d-flex");
    $("#descritionTextureSpecial").removeClass("d-flex");
  });

  // main carousel thumbnail indicator
  // $('#carouselMain').on('slide.bs.carousel', function () {
  //   var indicators = $(".carousel-thumbnail");
  //   indicators.find("li.active").removeClass("active");
  //   var carouselItemIndex = $(this).find('.carousel-item.active').index();
  //   indicators.find('li[data-slide-to="' + carouselItemIndex + '"]').addClass('active');
  // });

  // main carousel 부트스트랩 소스 코드
  // _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
  //   if (this._indicatorsElement) {
  //     var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector.ACTIVE));
  //     $(indicators).removeClass(ClassName.ACTIVE);

  //     var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

  //     if (nextIndicator) {
  //       $(nextIndicator).addClass(ClassName.ACTIVE);
  //     }
  //   }
  // };

  // 쇼핑 히스토리 스크롤 이벤트
  // var floatPosition = parseInt($("#recentlyViewed").css('top'));
  // $(window).scroll(function () {
  //   var scrollTop = $(window).scrollTop();
  //   var newPosition = scrollTop + floatPosition + "px";
  //   $("#recentlyViewed").stop().animate({
  //     "top": newPosition
  //   }, 400);
  // }).scroll();

  // Bootstrap file input 
  // bsCustomFileInput.init();

});