import { Cavern } from "../engine/cavern";
import SvgHelper from "../helpers/svgHelper";

const svgHelper = new SvgHelper();

export const getPlayerIcon = (cavern: Cavern | null, width = 150, height = 150, offsetX = 0, offsetY = 0): JSX.Element => {
    if (cavern != null && cavern.playerDirection === undefined) {
        return (<></>);
    }

    offsetX -= 8;
    offsetY -= 8;

    return (
        <svg height={width} width={height} viewBox={`${offsetX} ${offsetY} 40 40`} xmlns="http://www.w3.org/2000/svg">
            <path stroke="black" strokeWidth=".5" fill="orange" d="M13.9 2.999A1.9 1.9 0 1 1 12 1.1a1.9 1.9 0 0 1 1.9 1.899zM13.544 6h-3.088a1.855 1.855 0 0 0-1.8 1.405l-1.662 6.652a.667.667 0 0 0 .14.573.873.873 0 0 0 .665.33.718.718 0 0 0 .653-.445L10 9.1V13l-.922 9.219a.71.71 0 0 0 .707.781h.074a.69.69 0 0 0 .678-.563L12 14.583l1.463 7.854a.69.69 0 0 0 .678.563h.074a.71.71 0 0 0 .707-.781L14 13V9.1l1.548 5.415a.718.718 0 0 0 .653.444.873.873 0 0 0 .665-.329.667.667 0 0 0 .14-.573l-1.662-6.652A1.855 1.855 0 0 0 13.544 6z" />
            <path fill="none" d="M0 0h24v24H0z" />
        </svg>);
}

export const getBatIcon = (width: number, height: number): JSX.Element => {
    return (<svg height={width} width={height} xmlns="http://www.w3.org/2000/svg"
        viewBox="-438 0 3507 1578" enableBackground="new 0 0 2630.048 1183.47">
        <path d="M2035.253,25.083c-51.166,220.999-227.512,428.018-504.138,500.478c-22.752-75.936-45.03-152.025-67.837-227.961
            c-24.491,25.841-49.177,51.487-73.668,77.313c-23.531-21.102-125.641-21.102-149.172,0c-24.491-25.827-49.177-51.473-73.668-77.313
            c-22.807,75.936-45.086,152.025-67.837,227.961c-275.93-72.278-453.239-280.633-504.138-500.478
            c-127.2,160.142-313.234,256.693-559.771,254.595c155.522,16.465,306.551,116.352,306.137,268.134
            c90.828-25.894,193.599-35.907,274.187,13.178c85.974,51.584,124.462,160.612,127.464,260.286
            c220.38-155.073,413.404,91.672,510.163,337.112c4.374-17.289,15.941-76.498,62.048-139.675
            c37.733,51.702,50.987,95.946,62.048,139.675c98.023-248.647,290.744-491.509,510.163-337.112
            c6.386-212.028,138.808-348.398,401.652-273.464c-0.42-153.907,153.318-251.956,306.137-268.134
            C2348.554,281.776,2161.748,184.337,2035.253,25.083z"/>
    </svg>)
}

export const getWumpusIcon = (width: number, height: number): JSX.Element => {
    return (<svg height={width} width={height} xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 900 900">
        <g>
            <path fill="#AC245E" d="M60.427,84.035l50.204,50.204l23.609-23.609L84.035,60.427L60.427,84.035z" />
            <path fill="#AC245E" d="M427.965,60.427l-50.204,50.204l23.609,23.609l50.203-50.205L427.965,60.427z" />
        </g>
        <path fill="#DC5AFF" d="M256,512C114.843,512,0,412.135,0,289.391S114.843,66.783,256,66.783s256,99.864,256,222.609 S397.157,512,256,512z" />
        <path fill="#C82AFF" d="M512,289.391c0-122.744-114.843-222.609-256-222.609V512C397.157,512,512,412.135,512,289.391z" />
        <path fill="#ECF4DA" d="M256,133.565c-67.511,0-122.435,54.934-122.435,122.435S188.489,378.435,256,378.435 S378.435,323.5,378.435,256S323.511,133.565,256,133.565z" />
        <path fill="#E6F8D2" d="M378.435,256c0-67.501-54.924-122.435-122.435-122.435v244.87 C323.511,378.435,378.435,323.5,378.435,256z" />
        <circle fill="#806749" cx="256" cy="256" r="55.652" />
        <path fill="#5F4D37" d="M311.652,256c0-30.736-24.917-55.652-55.652-55.652v111.304 C286.736,311.652,311.652,286.736,311.652,256z" />
        <path fill="#FFFFFF" d="M272.696,256c-9.208,0-16.696-7.492-16.696-16.696s7.487-16.696,16.696-16.696 c9.208,0,16.696,7.492,16.696,16.696S281.904,256,272.696,256z" />
        <path fill="#5F4D37" d="M322.783,445.217H200.348c-9.223,0-16.696-7.473-16.696-16.696s7.473-16.696,16.696-16.696h122.435 c9.223,0,16.696,7.473,16.696,16.696S332.005,445.217,322.783,445.217z" />
        <circle fill="#DC5AFF" cx="50.087" cy="50.087" r="50.087" />
        <path fill="#C82AFF" d="M100.174,50.087C100.174,22.424,77.749,0,50.087,0v100.174 C77.749,100.174,100.174,77.749,100.174,50.087z" />
        <circle fill="#DC5AFF" cx="461.913" cy="50.087" r="50.087" />
        <path fill="#C82AFF" d="M512,50.087C512,22.424,489.576,0,461.913,0v100.174C489.576,100.174,512,77.749,512,50.087z" />
    </svg>);
}

export const getCavernIcon = (cavern: Cavern, width = 150, height = 150, background = "white"): JSX.Element => {
    let cellColor = cavern.isAdjacentPit ? "greenyellow" : cavern.isPit ? "green" : "brown";

    return (
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150, 150">
            <path d={svgHelper.describeArc(75, 75, 65, 0, 359.9)} stroke={cellColor} fill="none" strokeWidth="5" />

            {cavern.isAdjacentPit && <>
                <path d={svgHelper.describeArc(75, 75, 69, 0, 359.9)} stroke="greenyellow" fill="none" strokeWidth="5" strokeDasharray="12 6" />
                <path d={svgHelper.describeArc(75, 75, 73, 0, 359.9)} stroke="greenyellow" fill="none" strokeWidth="5" /></>}

            {cavern.north !== undefined && <><path d={svgHelper.describeArc(75, 75, 65, -15, 15)} stroke={background} fill="none" strokeWidth="22" />
                <line x1="60" y1="0" x2="60" y2="14" stroke={cellColor} strokeWidth="5" />
                <line x1="90" y1="0" x2="90" y2="14" stroke={cellColor} strokeWidth="5" /></>}

            {cavern.east !== undefined && <><path d={svgHelper.describeArc(75, 75, 65, 75, 105)} stroke={background} fill="none" strokeWidth="22" />
                <line x1="135" y1="60" x2="150" y2="60" stroke={cellColor} strokeWidth="5" />
                <line x1="135" y1="90" x2="150" y2="90" stroke={cellColor} strokeWidth="5" /></>}

            {cavern.south !== undefined && <><path d={svgHelper.describeArc(75, 75, 65, 165, 195)} stroke={background} fill="none" strokeWidth="22" />
                <line x1="60" y1="135" x2="60" y2="150" stroke={cellColor} strokeWidth="5" />
                <line x1="90" y1="135" x2="90" y2="150" stroke={cellColor} strokeWidth="5" /></>}

            {cavern.west !== undefined && <><path d={svgHelper.describeArc(75, 75, 65, 255, 285)} stroke={background} fill="none" strokeWidth="22" />
                <line x1="0" y1="60" x2="14" y2="60" stroke={cellColor} strokeWidth="5" />
                <line x1="0" y1="90" x2="14" y2="90" stroke={cellColor} strokeWidth="5" /></>}

            {cavern.isPit && <path d={svgHelper.describeArc(75, 75, 57, 0, 359.9)} stroke="green" fill="none" strokeWidth="5" />}

            {cavern.hasBlood && <circle cx="75" cy="75" r="40" stroke="red" fill="red" />}

            {cavern.hasWumpus && getWumpusIcon(150, 150)}

            {cavern.hasBat && getBatIcon(150, 150)}

            {getPlayerIcon(cavern)}
        </svg>
    );
}