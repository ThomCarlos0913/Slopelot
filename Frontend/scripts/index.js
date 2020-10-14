// http://aduinno.pythonanywhere.com/
// http://aduinno.pythonanywhere.com
var IndexVue = new Vue({
    el: "#index-vue",
    data: {
        test_message: "Hello World!",
        days: [],

        num_of_divide_pagination: 0,
        current_page: 1,

        // filters
        selected_probe: "Probe 1",
        start_date: '',
        end_date: '',

        // module 1 pitch and roll
        p11: 0,
        p21: 0,
        p31: 0,
        r11: 0,
        r21: 0,
        r31: 0,

        // module 2 pitch and roll
        p12: 0,
        p22: 0,
        p32: 0,
        r12: 0,
        r22: 0,
        r32: 0,

        // module 3 pitch and roll
        p13: 0,
        p23: 0,
        p33: 0,
        r13: 0,
        r23: 0,
        r33: 0,

        // charts
        mchart1: null,
        achart1: null,
        mchart2: null,
        achart2: null,
        mchart3: null,
        achart3: null,
        trace1: null,
        data1: null,
        trace2: null,
        data2: null,
        trace3: null,
        data3: null,
        layout: {
            margin: { l: 0, r: 0, b: 0, t: 0 },
            showlegend: false
        },

        // table data
        table_data: null,
        filtered_data: null,
        display_data: null,
        pdf_list: [],

        // Console Log
        console_log: null
    },
    methods: {
        unpack: function (rows, key) {
            return rows.map(function (row) { return row[key]; });
        },
        export_pdf: async function () {
            // JS PDF
            var doc = new jsPDF('l');

            var data = this.filtered_data;
            var current = this.selected_probe;

            this.pdf_list = [];
            for (var key in this.filtered_data) {
                this.pdf_list.push([key, data[key]['accel1x'], data[key]['accel1y'], data[key]['accel1z'], data[key]['soil1'],
                    data[key]['accel2x'], data[key]['accel2y'], data[key]['accel2z'], data[key]['soil2'],
                    data[key]['accel3x'], data[key]['accel3y'], data[key]['accel3z'], data[key]['soil3'], data[key]['time']])
            }

            var totalPagesExp = "{total_pages_count_string}";

            doc.autoTable({
                head: [['Id', 'Accel1 x', 'Accel1 y', 'Accel1 z', 'Soil1', 'Accel2 x', 'Accel2 y', 'Accel2 z', 'Soil2', 'Accel3 x', 'Accel3 y', 'Accel3 z', 'Soil3', 'Time']],
                body: this.pdf_list,
                margin: { top: 25 },
                didDrawPage: function (data) {

                    // Header
                    doc.setFontSize(12);
                    doc.setFontStyle('bold');
                    doc.text("Slopelot: Slope Monitoring", data.settings.margin.left, 22);
                    switch (current) {
                        case "Probe 1":
                            doc.text("Probe 1", 267, 22);
                            break;
                        case "Probe 2":
                            doc.text("Probe 2", 267, 22);
                            break;
                        case "Probe 3":
                            doc.text("Probe 3", 267, 22);
                            break;
                        default:
                            doc.text("Probe 1", 267, 22);
                            break;
                    }

                    // Footer
                    var str = "Page " + doc.internal.getNumberOfPages()
                    if (typeof doc.putTotalPages === 'function') {
                        str = str + " of " + totalPagesExp;
                    }
                    doc.setFontSize(10);

                    var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    doc.text(str, data.settings.margin.left, pageHeight - 10);

                    doc.setFontStyle("bold");
                    doc.text("Data as of " + Date(Date.now()).toString(), 157, pageHeight - 10);
                },
            })

            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            var today = new Date();
            var date = today.getDate() + '' + (today.getMonth() + 1) + '' + today.getFullYear();
            doc.save('data_' + date + '.pdf');
        },
        change_filter: async function () {
            this.start_date = document.getElementById('time-start').value;
            this.end_date = document.getElementById('time-end').value;

            document.getElementsByClassName('spinner-container')[0].style.display = "block";
            if (this.start_date != '' || this.end_date != '') {
                var today = new Date();
                if (this.start_date == '') {
                    this.start_date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    this.start_date = this.start_date.split("/")[2] + '-' + this.start_date.split("/")[0] + '-' + this.start_date.split("/")[1]
                }
                if (this.end_date == '') {
                    this.end_date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    this.end_date = this.end_date.split("/")[2] + '-' + this.end_date.split("/")[0] + '-' + this.end_date.split("/")[1]
                }

                switch (this.selected_probe) {
                    case "Probe 1":
                        await this.get_table_data("1", '1', this.start_date, this.end_date);
                        break;
                    case "Probe 2":
                        await this.get_table_data("2", '1', this.start_date, this.end_date);
                        break;
                    case "Probe 3":
                        await this.get_table_data("3", '1', this.start_date, this.end_date);
                        break;
                }

            } else {
                switch (this.selected_probe) {
                    case "Probe 1":
                        await this.get_table_data("1", '0', 0, 0);
                        break;
                    case "Probe 2":
                        await this.get_table_data("2", '0', 0, 0);
                        break;
                    case "Probe 3":
                        await this.get_table_data("3", '0', 0, 0);
                        break;
                }
            }
            document.getElementsByClassName('spinner-container')[0].style.display = "none";
        },
        change_tab: function (n) {
            switch (n) {
                case 0:
                    document.getElementsByClassName('dashboard-container')[0].style.display = "block";
                    document.getElementsByClassName('data-container')[0].style.display = "none";
                    document.getElementsByClassName('threed-container')[0].style.display = "none";
                    document.getElementsByClassName('log-container')[0].style.display = "none";
                    document.getElementsByClassName('nav-tab-item')[0].style.backgroundColor = "#f2f2f2";
                    document.getElementsByClassName('nav-tab-item')[1].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[2].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[3].style.backgroundColor = "#d9d9d9";
                    break;
                case 1:
                    document.getElementsByClassName('dashboard-container')[0].style.display = "none";
                    document.getElementsByClassName('data-container')[0].style.display = "block";
                    document.getElementsByClassName('threed-container')[0].style.display = "none";
                    document.getElementsByClassName('log-container')[0].style.display = "none";
                    document.getElementsByClassName('nav-tab-item')[0].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[1].style.backgroundColor = "#f2f2f2";
                    document.getElementsByClassName('nav-tab-item')[2].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[3].style.backgroundColor = "#d9d9d9";
                    break;
                case 2:
                    document.getElementsByClassName('dashboard-container')[0].style.display = "none";
                    document.getElementsByClassName('data-container')[0].style.display = "none";
                    document.getElementsByClassName('threed-container')[0].style.display = "block";
                    document.getElementsByClassName('log-container')[0].style.display = "none";
                    document.getElementsByClassName('nav-tab-item')[0].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[1].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[2].style.backgroundColor = "#f2f2f2";
                    document.getElementsByClassName('nav-tab-item')[3].style.backgroundColor = "#d9d9d9";
                    break;
                case 3:
                    document.getElementsByClassName('dashboard-container')[0].style.display = "none";
                    document.getElementsByClassName('data-container')[0].style.display = "none";
                    document.getElementsByClassName('threed-container')[0].style.display = "none";
                    document.getElementsByClassName('log-container')[0].style.display = "block";
                    document.getElementsByClassName('nav-tab-item')[0].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[1].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[2].style.backgroundColor = "#d9d9d9";
                    document.getElementsByClassName('nav-tab-item')[3].style.backgroundColor = "#f2f2f2";
                    break;
            }
        },
        increment_decrement_pagination: function (n) {
            switch (n) {
                case 1:
                    this.change_pagination(this.current_page + 1)
                    break;
                case 2:
                    this.change_pagination(this.current_page - 1)
                    break;
            }
        },
        change_pagination: function (param) {
            this.display_data = Object.entries(this.table_data).slice((param * 10) - 10, param * 10);
            document.getElementsByClassName('pagination-btn')[this.current_page - 1].classList.remove("active-pagination");
            document.getElementsByClassName('pagination-btn')[param - 1].className += " active-pagination";
            this.current_page = param;
        },
        get_table_data: async function (param, time_param, start_param, end_param) {
            let string_query = 'mod=' + param + '&&time=' + time_param + '&&start=' + start_param + '&&end=' + end_param;
            await axios.get("http://aduinno.pythonanywhere.com/get_table_data?" + string_query)
                .then(response => {
                    this.table_data = response.data;
                    this.filtered_data = this.table_data;
                })
            this.num_of_divide_pagination = Math.floor(Object.keys(this.table_data).length / 10) + 1;
            this.display_data = await Object.entries(this.table_data).slice(0, 10);
            document.getElementsByClassName('pagination-btn')[0].className += " active-pagination";
        },
        get_logs: async function() {
            // Get console logs 
            await axios.get("http://aduinno.pythonanywhere.com/get_logs")
            .then(response=> {
                this.console_log = response.data;
            });
        },
        get_moisture_data: function () {
            axios.get("http://aduinno.pythonanywhere.com/get_soil_moisture")
                .then(response => {
                    // Probe 1
                    // Moisture
                    var moisture = response.data;
                    this.mchart1.data.datasets[0].data = [moisture['soil3'], moisture['soil2'], moisture['soil1'], 0, 100];
                    this.mchart1.update();
                });
        }
    },
    mounted: async function () {
        Chart.defaults.global.legend.display = false;

        setInterval(this.get_moisture_data, 1000 * 60 * 5);

        // Build Graphs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Probe 1
        var mgraph1 = document.getElementById('moisture-graph1').getContext('2d');
        this.mchart1 = new Chart(mgraph1, {
            type: 'horizontalBar',
            data: {
                labels: ['Upper Sensor', 'Middle Sensor', 'Lower Sensor'],
                datasets: [{
                    label: 'Sensor Percentage',
                    data: [0, 0, 0, 0, 100]
                }]
            }
        });

        // Probe 2
        var mgraph2 = document.getElementById('moisture-graph2').getContext('2d');
        this.mchart2 = new Chart(mgraph2, {
            type: 'horizontalBar',
            data: {
                labels: ['Upper Sensor', 'Middle Sensor', 'Lower Sensor'],
                datasets: [{
                    label: 'Sensor Percentage',
                    data: [0, 0, 0, 0, 100]
                }]
            }
        });

        // Probe 3
        var mgraph3 = document.getElementById('moisture-graph3').getContext('2d');
        this.mchart3 = new Chart(mgraph3, {
            type: 'horizontalBar',
            data: {
                labels: ['Upper Sensor', 'Middle Sensor', 'Lower Sensor'],
                datasets: [{
                    label: 'Sensor Percentage',
                    data: [0, 0, 0, 0, 100]
                }]
            }
        });


        // Get probe payload >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Probe 1
        await axios.get("http://aduinno.pythonanywhere.com/get_latest_data")
            .then(response => {
                // Probe 1
                // Moisture
                var sdata = response.data;
                this.mchart1.data.datasets[0].data = [sdata['soil3'], sdata['soil2'], sdata['soil1'], 0, 100];
                this.mchart1.update();

                this.trace1 = {
                    x: [sdata['accel1x'], sdata['accel2x'], sdata['accel3x']], y: [sdata['accel1y'], sdata['accel2y'], sdata['accel3y']], z: [sdata['accel1z'], sdata['accel2z'], sdata['accel3z']],
                    mode: 'markers',
                    marker: {
                        color: 'rgb(0, 102, 255)',
                        size: 10,
                        symbol: 'circle',
                        line: {
                            color: 'rgb(0, 102, 255)',
                            width: 1
                        },
                        opacity: 0.8
                    },
                    type: 'scatter3d'
                };

                this.data1 = [this.trace1];
                Plotly.newPlot('accel-graph1', this.data1, this.layout);
            })

        // Probe 2
        await axios.get("http://aduinno.pythonanywhere.com/get_latest_data?mod=2")
            .then(response => {
                // Probe 1
                // Moisture
                var sdata = response.data;
                this.mchart2.data.datasets[0].data = [sdata['soil3'], sdata['soil2'], sdata['soil1'], 0, 100];
                this.mchart2.update();

                this.trace2 = {
                    x: [sdata['accel1x'], sdata['accel2x'], sdata['accel3x']], y: [sdata['accel1y'], sdata['accel2y'], sdata['accel3y']], z: [sdata['accel1z'], sdata['accel2z'], sdata['accel3z']],
                    mode: 'markers',
                    marker: {
                        color: 'rgb(0, 102, 255)',
                        size: 10,
                        symbol: 'circle',
                        line: {
                            color: 'rgb(0, 102, 255)',
                            width: 1
                        },
                        opacity: 0.8
                    },
                    type: 'scatter3d'
                };

                this.data2 = [this.trace2];
                Plotly.newPlot('accel-graph2', this.data2, this.layout);
            })

        // Probe 3
        await axios.get("http://aduinno.pythonanywhere.com/get_latest_data?mod=3")
            .then(response => {
                // Probe 1
                // Moisture
                var sdata = response.data;
                this.mchart3.data.datasets[0].data = [sdata['soil3'], sdata['soil2'], sdata['soil1'], 0, 100];
                this.mchart3.update();

                this.trace3 = {
                    x: [sdata['accel1x'], sdata['accel2x'], sdata['accel3x']], y: [sdata['accel1y'], sdata['accel2y'], sdata['accel3y']], z: [sdata['accel1z'], sdata['accel2z'], sdata['accel3z']],
                    mode: 'markers',
                    marker: {
                        color: 'rgb(0, 102, 255)',
                        size: 10,
                        symbol: 'circle',
                        line: {
                            color: 'rgb(0, 102, 255)',
                            width: 1
                        },
                        opacity: 0.8
                    },
                    type: 'scatter3d'
                };

                this.data3 = [this.trace3];
                Plotly.newPlot('accel-graph3', this.data3, this.layout);
            });

        // Get Table Inital Table Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        await this.get_table_data("1", '0', '0', '0');
        this.get_logs();

        // Initialize 3D Components >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Camera Setup 
        var camera = new THREE.PerspectiveCamera(75, 1);
        camera.position.z = 30;
        camera.position.x = 0;
        camera.position.y = 0;

        // Lighting Setup
        var light = new THREE.PointLight(0xFFFFFF, 1, 500);
        light.position.set(10, 0, 25);

        // Material Setup
        var material = new THREE.MeshLambertMaterial({color: 0xcca300, depthTest: false});

        // MODULE 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var module1_renderer = new THREE.WebGLRenderer({antialias: true});
        module1_renderer.setClearColor("#f2f2f2");
        module1_renderer.setSize(document.getElementsByClassName('module-container')[0].offsetWidth, 578);
        document.getElementById('module-1').appendChild(module1_renderer.domElement);

        var module1_scene = new THREE.Scene();
        module1_scene.add(light);

        // Module 1 Cylinders
        // Upper Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module1_up = new THREE.Mesh(geometry, material.clone());
        module1_up.rotation.set(0, 0, 0);
        module1_up.position.set(0, 10, 0);
        module1_scene.add(module1_up);

        // Middle Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module1_mid = new THREE.Mesh(geometry, material.clone());
        module1_mid.rotation.set(0, 0, 0);
        module1_mid.position.set(0, 0, 0);
        module1_scene.add(module1_mid);

        // Lower Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module1_low = new THREE.Mesh(geometry, material.clone());
        module1_low.rotation.set(0, 0, 0);
        module1_low.position.set(0, -10, 0);
        module1_scene.add(module1_low);

        module1_renderer.render(module1_scene, camera);

        // MODULE 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var module2_renderer = new THREE.WebGLRenderer({antialias: true});
        module2_renderer.setClearColor("#f2f2f2");
        module2_renderer.setSize(document.getElementsByClassName('module-container')[0].offsetWidth, 578);
        document.getElementById('module-2').appendChild(module2_renderer.domElement);

        var module2_scene = new THREE.Scene();
        module2_scene.add(light);

        // Module 2 Cylinders
        // Upper Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module2_up = new THREE.Mesh(geometry, material.clone());
        module2_up.rotation.set(0, 0, 0);
        module2_up.position.set(0, 10, 0);
        module2_scene.add(module2_up);

        // Middle Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module2_mid = new THREE.Mesh(geometry, material.clone());
        module2_mid.rotation.set(0, 0, 0);
        module2_mid.position.set(0, 0, 0);
        module2_scene.add(module2_mid);

        // Lower Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module2_low = new THREE.Mesh(geometry, material.clone());
        module2_low.rotation.set(0, 0, 0);
        module2_low.position.set(0, -10, 0);
        module2_scene.add(module1_low);

        module2_renderer.render(module2_scene, camera);

        // MODULE 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var module3_renderer = new THREE.WebGLRenderer({antialias: true});
        module3_renderer.setClearColor("#f2f2f2");
        module3_renderer.setSize(document.getElementsByClassName('module-container')[0].offsetWidth, 578);
        document.getElementById('module-3').appendChild(module3_renderer.domElement);

        var module3_scene = new THREE.Scene();
        module3_scene.add(light);

        // Module 3 Cylinders
        // Upper Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module3_up = new THREE.Mesh(geometry, material.clone());
        module3_up.rotation.set(0, 0, 0);
        module3_up.position.set(0, 10, 0);
        module3_scene.add(module3_up);

        // Middle Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module3_mid = new THREE.Mesh(geometry, material.clone());
        module3_mid.rotation.set(0, 0, 0);
        module3_mid.position.set(0, 0, 0);
        module3_scene.add(module3_mid);

        // Lower Cylinder
        var geometry = new THREE.CylinderGeometry(3, 3, 8, 100);
        var module3_low = new THREE.Mesh(geometry, material.clone());
        module3_low.rotation.set(0, 0, 0);
        module3_low.position.set(0, -10, 0);
        module3_scene.add(module3_low);

        module3_renderer.render(module3_scene, camera);

        // Hide container after loading all
        document.getElementsByClassName('threed-container')[0].style.display = "none";


        // Miscellaneous Initialization >>>>>>>>>>>>>>>>>>>
        // Initialize Date Picker
        $('#time-start').datepicker({
            uiLibrary: 'bootstrap4',
            onSelect: function (dateText, inst) {
                alert(dateText);
            }
        });
        $('#time-end').datepicker({
            uiLibrary: 'bootstrap4'
        });


        document.getElementsByClassName('main-spinner-container')[0].style.display = "none";

        setInterval(async () => {

            axios.get("http://aduinno.pythonanywhere.com/get_accel_rotation1?mod=3")
                .then(response => {
                    var data = response.data;

                    // Setup module 3
                    module3_up.rotation.x = -1*(data['pitch3'] - 1.5);
                    module3_up.rotation.z = -1*(data['roll3'] - 1.5) * -1;
                    module3_scene.add(module3_up);
                    module3_renderer.render(module3_scene, camera);

                    module3_mid.rotation.x = -1*(data['pitch2'] - 1.5);
                    module3_mid.rotation.z = -1*(data['roll2'] - 1.5) * -1;
                    module3_scene.add(module3_mid);
                    module3_renderer.render(module3_scene, camera);

                    module3_low.rotation.x = (data['pitch1'] - 1.5);
                    module3_low.rotation.z = (data['roll1'] - 1.5) * -1;
                    module3_scene.add(module3_low);
                    module3_renderer.render(module3_scene, camera);

                    this.p13 = data['pitch3'] - 1.5;
                    this.p23 = data['pitch2'] - 1.5;
                    this.p33 = data['pitch1'] - 1.5;
                    this.r13 = data['roll3'] - 1.5;
                    this.r23 = data['roll2'] - 1.5;
                    this.r33 = data['roll1'] - 1.5;
                });

                await axios.get("http://aduinno.pythonanywhere.com/get_latest_data?mod=3")
                    .then(response => {
                        // Probe 1
                        // Moisture
                        var sdata = response.data;
                        this.mchart3.data.datasets[0].data = [sdata['soil3'], sdata['soil2'], sdata['soil1'], 0, 100];
                        this.mchart3.update();

                        /*
                        this.trace3 = {
                            x: [sdata['accel1x'], sdata['accel2x'], sdata['accel3x']], y: [sdata['accel1y'], sdata['accel2y'], sdata['accel3y']], z: [sdata['accel1z'], sdata['accel2z'], sdata['accel3z']],
                            mode: 'markers',
                            marker: {
                                color: 'rgb(0, 102, 255)',
                                size: 10,
                                symbol: 'circle',
                                line: {
                                    color: 'rgb(0, 102, 255)',
                                    width: 1
                                },
                                opacity: 0.8
                            },
                            type: 'scatter3d'
                        };

                        this.data3 = [this.trace3];
                        Plotly.newPlot('accel-graph3', this.data3, this.layout);*/
                    });
        }, 100);
    }
})