document.getElementById('csvFile').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        complete: (results) => {
            const data = results.data;
            createFlowchart(data);
        },
    });
}

function createFlowchart(data) {
    const nodes = data.map((d) => ({
        id: d.jiraID,
        blockedBy: d.blockedby,
    }));

    const links = nodes
        .filter((node) => node.blockedBy)
        .map((node) => ({
            source: node.blockedBy,
            target: node.id,
        }));

    const svg = d3.select('#flowchart').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', [0, 0, 800, 800].join(' '));

    const g = svg.append('g');

    const link = g.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-width', 2);

    const node = g.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 20)
        .attr('fill', '#69b3a2');

    const label = g.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .text((d) => d.id)
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em');

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).distance(100).id((d) => d.id))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(400, 400));

    simulation.on('tick', () => {        link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

    node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);

    label
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y);
});
}

