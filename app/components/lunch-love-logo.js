import Ember from 'ember';

export default Ember.Component.extend({

    classNames: 'lunch-love-logo',

    ////////////
    // Events //
    ////////////

    didInsertElement: function() {
        const container = this.$(),
            canvas = container.find('canvas')[0],
            ctx = canvas.getContext('2d');
        //first set canvas size
        canvas.width = 300;
        canvas.height = 225;
        //draw heart image
        let img = new Image(); // Create new img element
        img.src = '/images/heart.png'; // Set source path
        img.addEventListener("load", function() {
            //draw text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'black';
            ctx.font = "bold 15px sans-serif";
            ctx.fillText("Alpert Medical School", canvas.width / 2 + 65, 5, canvas.width);
            ctx.font = "bold 100px monospace";
            ctx.fillStyle = '#4c4c4c';
            ctx.fillText("LUNCH", canvas.width / 2, 10, canvas.width);
            ctx.fillStyle = '#990000';
            ctx.fillText("L  VE", canvas.width / 2, 90);
            // execute drawImage statements here
            ctx.drawImage(img, 75, 65, 100, 150);
        }, false);
    }
});
