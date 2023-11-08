import Point from "./point";

class SvgHelper {
    public polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): Point {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return new Point(centerX + (radius * Math.cos(angleInRadians)), centerY + (radius * Math.sin(angleInRadians)));
    }

    public describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {

        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }
}

export default SvgHelper;