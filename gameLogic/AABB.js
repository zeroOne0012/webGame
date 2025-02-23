const AABB = (Ax, Ay, Awidth, Aheight, Bx, By, Bwidth, Bheight) => {
    const Ax1 = Ax, Ay1 = Ay;
    const Ax2 = Ax + Awidth, Ay2 = Ay + Aheight;
    const Bx1 = Bx, By1 = By;
    const Bx2 = Bx + Bwidth, By2 = By + Bheight;

    // console.log("TEST", Ax1,Ay1,Ax2,Ay2,Bx1,By1,Bx2,By2);
    if (Ax2 < Bx1 || Ax1 > Bx2) return false;
    if (Ay2 < By1 || Ay1 > By2) return false;
    return true;
};

module.exports = AABB;
