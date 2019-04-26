function printGarden() {
    window.print()
}

$(document).ready(function(){
    console.log(garden)
    $.each(garden.pots, function(index, value) {
        var pot_size = value.size
        var min_idx = Math.min.apply(Math, value.idxs);
        var max_idx = min_idx + pot_size - 1


        $.each(value.herbs, function(index, value) {
            id = "#" + value.idx 
            herb = herbs[value.herb_id]
            $(id).html('<img src="' + herb.image + '" alt="' + herb.name + '" class="pot-herb">')

            if (pot_size > 1) {
                $(id).addClass("r-pot-background")
                if (index == min_idx) {
                    $(id).addClass("left")
                } else if (index == max_idx) {
                    $(id).addClass("right")
                } else {
                    $(id).addClass("center")
                }
            } else if (pot_size == 1) {
                $(id).addClass("pot-background")
            }

            name_id = id + "name"
            $(name_id).html(herb.name)
        })
    })

    $(".print-button").click(function() {
        printGarden()
    })
})