const height_bc = 500;

const width = 700;
const height = 550;
const LARGE_POP = 10 ** 6;





const svgBuilding = d3.select('.building-plot')
    .append('svg')
    .attr('height', height_bc)
    .attr('width', height_bc)

const svgCities = d3.select('.population-plot')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

const parseDataBuilding = datum => ({
    ...datum,
    height_px: +datum.height_px,
    height_ft: +datum.height_ft,
})

const parseData = datum => ({
    ...datum,
    eu: datum.eu==='true', // convert to boolean
    population: +datum.population,
    x: +datum.x,
    y: +datum.y,
})


const filterBuilding = datum=> datum.sort(function(a, b) {return d3.descending(a.height_ft, b.height_ft)});


const filterEu = datum => datum.eu

const setCityLength = cities => d3.select('.city-count').text("Number of cities: " + cities.length)

const deriveRadius = population => population < LARGE_POP ? 4 : 8


const plotData = cities => {
    const elems = svgCities.selectAll()
        .data(cities)
        .enter()
        .append("g")
        .attr("transform", datum => `translate(${datum.x},${datum.y})`)

    const circles = elems
        .append('circle')
        .attr('r', datum => deriveRadius(datum.population))

    const labels = elems
        .filter(datum => datum.population >= LARGE_POP)
        .append('text')
        .attr('text-anchor', "middle")
        .attr('font-size', 11)
        .attr('dy', -14)
        .text(datum => datum.city)
}




const plotDataBuilding = buildings =>{
    

    const elems = svgBuilding.selectAll()
        .data(buildings)
        .enter()
        .append("g")
        .attr("transform", function (datum,i){
        return`translate(${50},${i*25})`
        })
    
    
    const rect = elems
        .append('rect')
        .attr('class','bar')
        .attr('x',40)
        .attr('width', datum=>(datum.height_px))
        .attr('height', 20)
        .on("click", (event,d) => {// event is passed first from D3

            d3.select('.height').text(d.height_ft);
            d3.select('.city').text(d.city);
            d3.select('.country').text(d.country);
            d3.select('.floors').text(d.floors);
            d3.select('.completed').text(d.completed);
            d3.select('.name').text(d.building);
            d3.select(".image").attr("src", "img/" + d.image);
          });


    const labels = elems
        .append('text')
        .attr('text-anchor', "end")
        .attr('font-size', 11)
        .attr('dx', 20)
        .attr('dy',18)
        .text(datum => datum.city)



    const heights = elems
        .append('text')
        .attr('text-anchor', "middle")
        .attr('font-size', 11)
        .attr('dx', datum=>(datum.height_px+20))
        .attr('dy',18)
        .text(datum => datum.height_ft) 
}




d3.csv('cities.csv', parseData)
 .then(cities => cities.filter(filterEu))
 .then(cities => {
     console.log(cities)
     setCityLength(cities);
     plotData(cities)
 })


 d3.csv('buildings.csv', parseDataBuilding)
 .then(buildings=> filterBuilding(buildings))
 .then(buildings => {
     console.log(buildings)
     plotDataBuilding(buildings)
 })

