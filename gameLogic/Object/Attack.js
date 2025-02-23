class Attack{

    constructor(){
        this.attacking = false;
        this.attackFrame = -1;
        this.attackRange = 50;


        this.x=0;
        this.y=0;
        this.width=50;
        this.height=50;

        this.aDir=1;
    }
    update(x,y){
        this.x=x;
        this.y=y;
    }

}
module.exports = Attack;
// export class Attack{
    
//     #arrData; // 좌표 

//     constructor(){
//         this.attacking = false;
//         this.attackFrame = 0;
//     }

//     get data(){
//         return arrData;
//     }

//     set data(arr){
//         this.#arrData = arr;
//     }
// }