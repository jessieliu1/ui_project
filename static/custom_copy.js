var curr_garden = {
    pots: [],
    size: 0
}

function init_view(herbs) {
    display_herbs(herbs)
    $(".print-button").html("Save Garden")
}

function display_herbs(herbs) {
    $("#herb-table").html("")
    var thead = $("<div>")
    $(thead).html("Herbs")
    var tbody = $("<div>")
    $.each(herbs, function(index, value) {
        // var td = $("<span title='" + value.name + "'>")
        var td = $("<span>")
        td.html('<img src="' + value.image + '" alt="' + value.name + '" class="draggable img-thumbnail" data-id=' + value.id +'>')
        $(tbody).append(td)
    })
    $("#herb-table").append(thead)
    $("#herb-table").append(tbody)
    $(".draggable").draggable({
        revert:"invalid", 
        zIndex: 400,
    });
}

function save_garden() {
    $.ajax({
        type: "POST",
        url: "/save_garden",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(curr_garden),
        success: function(result) {
            console.log("Garden saved")
            if (result.redirect) {
                window.location.href = result.redirect;
            }
        },
        error: function(request, status, error) {
            alert("Adding entry was unsuccessful!!!!!")
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

function add_to_pot(pot_idx, pot_herb) {
    $.each(curr_garden.pots, function (index, value) {
        if (value.idxs.includes(pot_idx)) {
            value.herbs.push(pot_herb)
        }
    })
    console.log(curr_garden)
}

$(document).ready(function(){
    curr_garden.size = size
    init_view(herbs)
    console.log("HELLO")

    $(".selectable").selectable({
        stop: function() {
            var invalid = false
            $.each($(".ui-selected"), function( index, value ) {
                if ($(value).hasClass("selectable-disabled")) {
                    invalid = true
                }
            })
            if (invalid) {
                $.each($(".ui-selected"), function( index, value ) {
                    $(value).removeClass("ui-selected")
                })
            }
            else if ($( ".ui-selected", this ).length > 0){
                $("#pot-confirm").addClass("active");
                $("#pot-confirm").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "Place pot": function() {
                            var pot_size = $(".ui-selected").length
                            var idxs = []         

                            $.each($(".ui-selected"), function( index, value ) {
                                idxs.push($(value).data("id"))
                                $(value).removeClass('ui-selected');
                                $(value).addClass('selectable-disabled')
                                
                                $(value).addClass('droppable');
                                if (pot_size == 1) {
                                    $(value).addClass('pot-background');
                                } else if (pot_size > 1) {
                                    $(value).addClass('r-pot-background');
                                    if (index == pot_size - 1) {
                                        $(value).removeClass('center').addClass('right');
                                    }
                                    if (index == 0) {
                                        $(value).removeClass('center').addClass('left');
                                    }
                                }
                                $(value).html("");
                            })

                            curr_garden.pots.push({size: pot_size, idxs: idxs, herbs: []})

                            $( this ).dialog( "close" );
                            $(".droppable").droppable({
                                accept: function(e) {
                                    return !$(this).hasClass("has-plant")
                                },
                                drop: function(event, ui) {
                                    var herb = $("<div>")
                                    value = herbs[$(ui.draggable).data("id")]
                                    $(herb).html('<img src="' + value.image + '" alt="' + value.name + '" class="pot-herb">')
                                    $(this).append(herb)
                                    $(this).addClass("has-plant")

                                    pot_herb = {
                                        herb_id: value.id,
                                        idx: $(this).data("id")
                                    }

                                    add_to_pot($(this).data("id"), pot_herb)
                                    display_herbs(herbs)
                                },
                                classes: {
                                    "ui-droppable-hover": "yellow",
                                    "ui-droppable-active": "pink"
                                }
                            })
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            }
        }
    })

    $(".print-button").click(function() {
        save_garden()
    })

    // $( document ).tooltip({
    //   track: true
    // });
})