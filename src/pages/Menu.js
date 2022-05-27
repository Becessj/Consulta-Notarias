import React, {useState, useEffect,useMemo} from 'react';
import Swal from "sweetalert2";  
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/Menu.css';
import MaterialTable from 'material-table';
import { Button, Container } from "@material-ui/core";
import { tableIcons } from "./IconProvider";
import Check from "@material-ui/icons/Check";
import { LocalPrintshop, RemoveRedEye } from '@material-ui/icons';
import  {MTableToolbar} from 'material-table'
import "bootstrap/dist/css/bootstrap.min.css";
import { Label, Input} from "reactstrap";
import { jsPDF } from "jspdf";
import {logo} from './images';
//import login from './Login';

const columns=[
  {title:'PERSONA',field:'PERSONA'},
  {title:'NOMBRE COMPLETO',field:'NOMBRE_COMPLETO'},
  {title:'DIRECCION FISCAL',field:'DIRECCION_FISCAL'},
  {title:'TIPO DOCUMENTO',field:'TIPO_DOC'},
  {title:'NRO DOCUMENTO',field:'NRO_DOC'},
  {title:'TIPO',field:'TIPO'},
  {title:'PREDIAL',field:'PREDIAL'},
  {title:'ALCABALA',field:'ALCABALA'},
  {title:'VEHICULAR',field:'VEHICULAR'},
  {title:'LIMPIEZA',field:'LIMPIEZA'}
];

const baseUrl="http://localhost:5000/api/personas";
const UrlNotarias="http://localhost:5000/api/notarias";
const UrlAuditorias="http://localhost:5000/api/auditorias";



function Menu(props) {  
  const[framework, setFramework] = useState("PREDIA");

  const cambioRadioFramework=e=>{
    setFramework(e.target.value);
  }
  
 
  const [radioValue, setRadioValue] = useState(false)
  const [radioValue1, setRadioValue1] = useState(false)
  const [radioValue2, setRadioValue2] = useState(false)
  const [data, setData]= useState([]);
  const [personas, setPersonas] = useState([]);
  const [persona, setPersona] = useState(null);
  const [dni, setDni] = useState('');
  const [generador, setGenerador] = useState('');
  const [user, setUser] = useState('');
 
/*   const [widgets, setWidgets] = useState([{PERSONA: "",
                                          CARPETAPREDIAL: "",
                                          NOMBRE_COMPLETO: "",
                                          NRO_DOC: "",
                                          PREDIO_U: "",
                                          OBS_UBICACION: "",
                                          AREA_TERRENO: "",
                                          HASTA: "",
                                          RECIBO: "",
                                          F_PAGO: "",
                                          GENERADOR: "",
                                          OBS: ""}]); */
                                          
    const [form, setForm]=useState({
        dni:'%',
        nombre: '%',
        contribuyente: '%'
      });
      
      const handleChange=e=>{
       const {name, value} = e.target;
       setForm({
         ...form,
         [name]: value
       });
       console.log(name);
       
        }
    const cookies = new Cookies();
  
    const audit=(persona,carpeta,generador)=>{
       axios.post(UrlAuditorias,{
                              CONTRIBUYENTE: persona,
                              PREDIO: carpeta,
                              GENERADOR: generador,
                              USUARIO: cookies.get('id')},
                              ).
                              then(res => {
                               /*  console.log(res);
                                console.log(res.data); */
                              }).catch(error=>{
                                     /*  console.log(error); 
                                      Swal.fire(
                                        'ERROR',
                                        ' No pudimos conectarnos con el servidor, intentalo otra vez',
                                        'error'
                                      )/* .then(response=>{
                                        window.location.href = window.location.href;
                                      }); */
              
            })
    }
    const buscar=async()=>{
        await axios.get(baseUrl+`/${form.dni}/${form.nombre}/${form.contribuyente}`)
        /*await axios.get(baseUrl)*/
        .then(response=>{
          let timerInterval
          Swal.fire({
            title: 'Buscando...!',
            html: 'Esto tomará unos <b></b> milliseconds.',
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              
            }
          })
          if(response.data.length>0){
            setData(response.data);
          }
          else{
            //console.log(response.data);
            Swal.fire(
              'Error!',
              'No existe en la base de datos',
              'error'
            );
          }
        }).catch(error=>{
          //console.log(error);
          Swal.fire(
            'ERROR!',
            'Debes digitar por lo menos un campo',
            'error'
          );
          
        })
      }
    const PanelTable = (persona,nrodoc) => {
        //console.log(framework);
        //buscarNotarias(persona.persona, nrodoc.nrodoc, framework,"%")
        //console.log(buscarNotarias(persona.persona, nrodoc.nrodoc, framework,"%"))
        const panelColumns = [{ title: "PERSONA", field: "PERSONA" },
                              { title: "CARPETA PREDIAL", field: "CARPETAPREDIAL" },
                              { title: "NOMBRE COMPLETO", field: "NOMBRE_COMPLETO" },
                              { title: "NRO DOC", field: "NRO_DOC" },
                              { title: "PREDIO U", field: "PREDIO_U" },
                              { title: "OBS", field: "OBS" },
                              { title: "AREA T.", field: "AREA_TERRENO" },
                              { title: "HASTA", field: "HASTA" },
                              { title: "RECIBO", field: "RECIBO" },
                              { title: "F_PAGO", field: "F_PAGO" },
                              { title: "GENERADOR", field: "GENERADOR" },
                              { title: "OBS_UBICACION", field: "OBS_UBICACION" }];
        return (
          <MaterialTable
            localization={{
              body: {
                emptyDataSourceMessage: "No hay datos para mostrar"
              },
              toolbar: {
                  addRemoveColumns: 'Agregar o eliminar columnas',
                  exportAriaLabel: 'Exportar',
                  exportName: 'Exportar a CSV',
                  exportTitle: 'Exportar',
                  nRowsSelected: '{0} filas seleccionadas',
                  searchPlaceholder: 'Buscar',
                  searchTooltip: 'Buscar',
                  showColumnsAriaLabel: 'Mostrar columnas',
                  showColumnsTitle: 'Mostrar columnas',
                }
            }}
            icons={tableIcons}
            columns={panelColumns}
            data={personas}
            options={{
              showTitle: false,
              draggable: false,
              headerStyle: { backgroundColor: "#ffefde" },
              bodyStyle: {
                overflowX: "scroll"
              },
              maxBodyHeight: "30vh",
              pageSizeOptions: [5],
              tableLayout: "auto"
            }}
            actions={[
                {
                  icon: () => <LocalPrintshop />,
                  tooltip: 'Imprimir',
                      onClick: (event, rowData) => 
                      Swal.fire({
                                title: '¿Estás seguro?',
                                text: "Las impresiones son contabilizadas en la base de datos principal",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Si, imprimir'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  verificarDeuda(rowData.PERSONA,rowData.CARPETAPREDIAL,rowData.NOMBRE_COMPLETO,rowData.PREDIO_U,rowData.OBS,rowData.HASTA,rowData.RECIBO,rowData.F_PAGO,framework,rowData.OBS_UBICACION)
                   
                                }
                              }) 
                }
              ]}
          />
        );
      };
      
      const changeGenerator=(generator)=>{
        var generador;
        switch(generator){
            case "PREDIA":
              generador = 'IMPUESTO PREDIAL';
            break;
            case "ALCABA":
              generador = 'IMPUESTO DE ALCABALA';
            break;
            case "IMPVEH":
              generador = 'IMPUESTO VEHICULAR';
            break;
            case "LIMPPU":
              generador = 'IMPUESTO DE LIMPIEZA PÚBLICA';
            break;
        }
        return generador;
    }
    const changeSN=(value)=>{
      var valor;
      switch(value){
          case "S":
            valor = 'SI TIENE';
          break;
          case "N":
            valor = 'NO TIENE';
          break;
      }
      return valor;
  }
    const timeToday=()=>{
      var today = new Date();
      var hora = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      return hora;
  }
    const dateToday=()=>{
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy ;
      return today;
  }
    const changeDateTime=(fechacompleta)=>{
      var today = new Date(fechacompleta);
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy ;
      return today;
  }

    const cerrarSesion=()=>{
        // console.log(cookies.get('id'));
        cookies.remove('id', {path: '/'});
        
        props.history.push('./');
        Swal.fire(
            'SESIÓN CERRADA',
            '',
            'error'
          );
    }
    
    const verificarDeuda=(persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago,framework,obs_ub)=>{
      if(obs=="EL CONTRIBUYENTE NO ADEUDA"){
        let timerInterval
        Swal.fire({
          title: 'Estamos generando la impresión',
          html: 'Esto tomará unos <b></b> milliseconds.',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          if(framework =='PREDIA' || framework =='ALCABA'){
            imprimirPredialAlcaba(persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago,obs_ub)
            audit(persona,predioU,framework,user)
          }
          else if(framework=='IMPVEH'){
            imprimirVehicular(persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago,obs_ub)
          }
          else{
            imprimirLimpieza(persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago,obs_ub)
          }
        })
           }
      else{
        Swal.fire({
          title: "<b>NO PUEDES IMPRIMIR</b>", 
          html: `<b>OBSERVACION: </b>`+obs+` hasta el año `+hasta ,  
          confirmButtonText: "Cancelar", 
          icon:"error"
        })
       
   
      }
     
  }
  
const imprimirPredialAlcaba = (persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago) => {
    
    const doc = new jsPDF('p', 'pt', 'a4', true);
     doc.addImage(logo, 'JPEG', 20, 5);
    doc.setFontSize(8);  
    doc.setDrawColor(0, 0, 0);
    doc.text(100, 30, 'MUNICIPALIDAD PROVINCIAL DE URUBAMBA')
    doc.text(100, 45, 'Dirección: JR. BOLIVAR NRO. S/N')
    doc.text(100, 60, 'RUC: 20147567449')
    //doc.setFont('courier');
    doc.setFontSize(18);  
    doc.setFont("Arial", "bold");
    doc.text(180, 170, 'CONSTANCIA DE NO ADEUDO',{ maxWidth: 1024, align: "justify" })
    //doc.text("This is example paragraph   1", 11,13,).setFontSize(8).setFont(undefined, 'bold');
    doc.setFont("Arial", "normal");
    //doc.text("This is example paragraph      2", 11,13,).setFontSize(8).setFont(undefined, 'normal');
    doc.setFontSize(12);  
    //doc.internal.write(0, "Tw") // <- add this
    doc.text('Que, la administrada '+ nombrecompleto +', se encuentra inscrita como '+
              'contribuyente en el registro predial que maneja la Administración Tributaria de la MUNICIPALIDAD PROVINCIAL DE URUBAMBA con Carpeta N°'+
              carpeta+' por el código del predio: '+predioU+' ubicado en el distrito de URUBAMBA, Provincia y Departamento del Cusco,'+
              ' habiendo cancelado el '+ changeGenerator(framework)+' del Ejercicio Gravable '+hasta+
              ' con recibo de pago '+'N° '+recibo+' en fecha '+ changeDateTime(f_pago)+' y haciendo constar que: NO ADEUDA el '+
               changeGenerator(framework)+' desde la fecha que es contribuyente hasta la actualidad.',100,250,{ maxWidth: 400, align: 'justify' });
    doc.text('Fecha:' + dateToday() +' y Hora: '+timeToday(),325, 400,{ maxWidth: 2300, align: 'justify' })
    var date = new Date();
    var filename ="MPU-"+predioU+".pdf";
    window.open(doc.output('bloburl'), '_blank');
}
const imprimirVehicular = (persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago,obs_ub) => {
    
  const doc = new jsPDF('p', 'pt', 'a4', true);
   doc.addImage(logo, 'JPEG', 20, 5);
  doc.setFontSize(8);  
  doc.setDrawColor(0, 0, 0);
  doc.text(100, 30, 'MUNICIPALIDAD PROVINCIAL DE URUBAMBA')
  doc.text(100, 45, 'Dirección: JR. BOLIVAR NRO. S/N')
  doc.text(100, 60, 'RUC: 20147567449')
  //doc.setFont('courier');
  doc.setFontSize(18);  
  doc.setFont("Arial", "bold");
  doc.text(180, 170, 'CONSTANCIA DE NO ADEUDO',{ maxWidth: 1024, align: "justify" })
  //doc.text("This is example paragraph   1", 11,13,).setFontSize(8).setFont(undefined, 'bold');
  doc.setFont("Arial", "normal");
  //doc.text("This is example paragraph      2", 11,13,).setFontSize(8).setFont(undefined, 'normal');
  doc.setFontSize(12);  
  //doc.internal.write(0, "Tw") // <- add this
  doc.text('Que, la administrada '+ nombrecompleto +', tiene registrado un vehiculo en la juridicción de la MUNICIPALIDAD PROVINCIAL DE URUBAMBA '+
            'del departamento de Cusco con placa de vehiculo N°'+
            predioU+' y modelo '+obs_ub+
            ' habiendo cancelado el '+ changeGenerator(framework)+' del Ejercicio Gravable '+hasta+
            ' con recibo de pago '+'N° '+recibo+' en fecha '+ changeDateTime(f_pago)+' y haciendo constar que: NO ADEUDA el '+
             changeGenerator(framework)+' desde la fecha que es dueño hasta la actualidad.',100,250,{ maxWidth: 400, align: 'justify' });
  doc.text('Fecha:' + dateToday() +' y Hora: '+timeToday(),325, 400,{ maxWidth: 2300, align: 'justify' })
  var date = new Date();
  var filename ="MPU-"+predioU+".pdf";
  doc.save(filename)
}
const imprimirLimpieza = (persona,carpeta,nombrecompleto,predioU,obs,hasta,recibo,f_pago) => {
  
  var doc = new jsPDF('p', 'pt');
  doc.setFontSize(12);  
  doc.text(100, 30, 'MUNICIPALIDAD PROVINCIAL DE URUBAMBA')
  doc.text(100, 45, 'Dirección: JR. BOLIVAR NRO. S/N')
  doc.text(100, 60, 'RUC: 20147567449')
  //doc.setFont('courier');
  doc.text(180, 170, 'CONSTANCIA DE NO ADEUDO')
  doc.text("This is example paragraph", 11,13,).setFontSize(8).setFont(undefined, 'bold');

  doc.text("This is example paragraph", 11,13,).setFontSize(8).setFont(undefined, 'normal');

  doc.text(30, 190,'Que, la administrada '+ nombrecompleto +' se encuentra inscrita como',{ align: "justify"})
  doc.text(30, 205,'contribuyente en el registro predial que maneja la Administración Tributaria de la MUNICIPALIDAD',{ align: "justify" })
  doc.text(30, 220,'PROVINCIAL DE URUBAMBA con Carpeta N°'+carpeta+' por el código del predio '+predioU,{ align: "justify"})
  doc.text(30, 235,'ubicado en el distrito de URUBAMBA, Provincia y Departamento del Cusco, habiendo cancelado',{ align: "justify"})
  doc.text(30, 250,'el '+ changeGenerator(framework)+' del Ejercicio Gravable '+hasta+ ' con recibo de pago N° '+recibo,{ align: "justify"})
  doc.text(30, 265,'en fecha '+ f_pago+' y haciendo constar que '+ obs,{ align: "justify"})
  doc.text(30, 280,changeGenerator(framework)+' desde la fecha que es contribuyente hasta la actualidad.',{ align: "justify"})
  doc.text(130, 320,'Fecha',{ align: "justify"})
 
  /* var text = "La coordinación del pago y envío de Boucher de depósito que confirmará la reserva, se realizarán mediante el celular N° 999388799. ";
  multiline(text,205);  */  
  
  //doc.text(20, 30, 'fuente courier')
 /*  doc.text(10,40, persona)
  doc.text(10,60, carpeta)
  doc.text(10,80, nombrecompleto)
  doc.text(10,100, predioU)
  doc.text(10,120, obs) */


  
  doc.save('Notaria.pdf')
}
const buscarNotarias=async(persona,nrodoc,framework,clave)=>{
  const result= await axios.get(UrlNotarias+`/${persona}/${nrodoc}/${framework}/${clave}`)
  /* console.log(result)
  console.log(framework) */
  setPersonas(result.data) 
}
    /* useEffect(() => {

      console.log("Changed Widgets: ", widgets)

  }, [widgets]) */
    useEffect(()=>{
        if(!cookies.get('id')){
          /* console.log(cookies.get('id')); */
            props.history.push('./');
        }
          },[]);
    //Renderiza la subtabla de la tabla principal
          useEffect(() => {
            /* console.log(persona)
            console.log(dni) */
            buscarNotarias(persona,dni,framework,'%')
            
          }, [persona])
    return (
      <><br></br>
      <Container maxWidth={"xl"}>
          <div className="containerMenu1">
            <h1>CONSULTA DE DEUDAS</h1>
            <div className="form-group">
              <div class="container-fluid cew-9">
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-3">
                  <input type="radio" onClick={(e) => setRadioValue(e.target.value)} value={radioValue} /><br></ br>
                   <label>DNI/RUC</label>  
                    <input
                      type="number"
                      required
                      className="form-control"
                      maxLength="11"
                      name="dni"
                      placeholder="Digita el DNI"
                      disabled={!radioValue} 
                      onChange={handleChange} 
                      onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        // Do code here
                        buscar()
                        ev.preventDefault();
                      }
                    }}
                    autoFocus  
                      />
                    <br />
                  </div>
                  <div class="col-12 col-sm-6 col-md-6">
                  <input type="radio" onClick={(e) => setRadioValue1(e.target.value)} value={radioValue1} /><br></ br>
                  <label>APELLIDOS</label>
                   <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      placeholder="Digita los apellidos"
                      disabled={!radioValue1} 
                      onChange={handleChange} 
                      onKeyPress={(ev) => {
                     
                      if (ev.key === 'Enter') {
                        // Do code here
                        buscar()
                        ev.preventDefault();
                      }
                    }}  
                      />
                    <br />
                  </div>
                  <div class="col-12 col-sm-12 col-md-3">
                  <input type="radio" onClick={(e) => setRadioValue2(e.target.value)} value={radioValue2} /><br></ br>
                  <label>CODIGO PRED.</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contribuyente"
                      placeholder="Digita el código predial"
                      disabled={!radioValue2} 
                      onChange={handleChange}
                      onKeyPress={(ev) => {
                      
                      if (ev.key === 'Enter') {
                        // Do code here
                        buscar()
                        ev.preventDefault();
                      }
                    }}
                     />
                    <br />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => buscar()}>Consultar</button>
            </div>
            </div>
            <div className="containerMenu2">
            <MaterialTable
               components={{
                    Action: props => (
                      <Button
                        startIcon={<RemoveRedEye />}
                        onClick={(event) => props.action.onClick(event, props.data)}
                        color="primary"
                        variant="contained"
                        style={{textTransform: 'none'}}
                        size="small"
                      >
                        
                      </Button>
                ),
                Toolbar: props => (
                        <div>
                          <MTableToolbar {...props} />
                          <div style={{padding: '0px 2px'}}>
                          <Input
                              id="predial"
                              type="radio"
                              value="PREDIA"
                              checked={framework == "PREDIA" ? true : false}
                              onChange={cambioRadioFramework}
                            />
                            <Label for="predial">
                              PREDIAL
                            </Label>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Input
                                id="alcabala"
                                type="radio"
                                value="ALCABA"
                                checked={framework == "ALCABA" ? true : false}
                                onChange={cambioRadioFramework}
                              />
                              <Label for="alcabala">
                                ALCABALA
                              </Label>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <Input
                                  id="vehicular"
                                  type="radio"
                                  value="IMPVEH"
                                  checked={framework == "IMPVEH" ? true : false}
                                  onChange={cambioRadioFramework}
                                />
                                <Label for="vehicular">
                                 VEHICULAR
                                </Label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Input
                                    id="limpieza"
                                    type="radio"
                                    value="LIMPPU"
                                    checked={framework == "LIMPPU" ? true : false}
                                    onChange={cambioRadioFramework}
                                  />
                                  <Label for="limpieza">
                                    LIMPIEZA
                                  </Label>
                          </div>
                     {/*      <p>El radio button seleccionado es: <b>{framework}</b></p> */}
                        </div>
                        
                      )
              }}
              icons={tableIcons}
              columns={columns}
              data={data}
              title="Selecciona el generador"
              
              actions={[
                {
                  icon: () => <Check />,
                  tooltip: 'Ver',
                  onClick: (event, rowData) =>
                                            Swal.fire({
                                            title: "<i>Información de la Persona</i>", 
                                            html: `<table id="table" border=1>
                                                 
                                                  <tbody>
                                                 
                                                      <tr>
                                                          
                                                          <td><b>CÓD. PERSONA </b></td>
                                                          <td>`+rowData.PERSONA+`</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>NRO DOCUMENTO</b></td>
                                                          <td>`+rowData.NRO_DOC +`</td>
                                                      </tr>
                                                      <tr>
                                                          
                                                          <td><b>NOMBRE COMPLETO</b></td>
                                                          <td>`+rowData.NOMBRE_COMPLETO +`</td>
                                                      </tr>
                                                      <tr>
                                                         
                                                          <td><b>DIRECCIÓN FISCAL</b></td>
                                                          <td>`+rowData.DIRECCION_FISCAL +`</td>
                                                      </tr>
                                                     
                                                      <tr>
                                                          <td><b>REGISTRO PREDIAL</b></td>
                                                          <td>`+changeSN(rowData.PREDIAL)+`</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>REGISTRO ALCABALA</b></td>
                                                          <td>`+changeSN(rowData.ALCABALA)+`</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>REGISTRO VEHICULAR</b></td>
                                                          <td>`+changeSN(rowData.VEHICULAR)  +`</td>
                                                      </tr>
                                                      <tr>
                                                          <td><b>REGISTRO LIMPIEZA PÚBLICA</b></td>
                                                          <td>`+changeSN(rowData.LIMPIEZA) +`</td>
                                                      </tr>
                                          </tbody>
                                          </table>` ,  
                                            confirmButtonText: "Cancelar", 
                                          })
                                             
                }
              ]}
              options={{
                //searchAutoFocus: true,
                //minBodyHeight: "85vh",
               // maxBodyHeight: "85vh",
                //selection: true,
                draggable: false,
                headerStyle: { backgroundColor: "#ffefde" },
                bodyStyle: {
                  overflowX: "scroll"
                },
                maxBodyHeight: "55vh",
                pageSizeOptions: [5],
                tableLayout: "auto"
                }}
              detailPanel={[
                {
                  tooltip: "Ver Detalles",
                  render: (rowData) => {
                    //console.log("LOGING -------------> ROWDATA", rowData);
                    setDni(rowData.NRO_DOC)
                    //console.log(dni)
                    setPersona(rowData.PERSONA)
                    //console.log(persona)
                    setGenerador(framework)
                    return <PanelTable persona={rowData.PERSONA} nrodni={rowData.NRO_DOC} />;
                  }
                }
              ]}
              onRowClick={(event, rowData, togglePanel) => togglePanel()}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No hay datos por mostrar',
                  addTooltip: 'Añadir',
                  deleteTooltip: 'Eliminar',
                  editTooltip: 'Editar',
                  filterRow: {
                    filterTooltip: 'Filtrar',
                  },
                  editRow: {
                    deleteText: '¿Segura(o) que quiere eliminar?',
                    cancelTooltip: 'Cancelar',
                    saveTooltip: 'Guardar',
                  },
                },
                grouping: {
                  placeholder: "Arrastre un encabezado aquí para agrupar",
                  groupedBy: 'Agrupado por',
                },
                header: {
                  actions: 'Acciones',
                },
                pagination: {
                  firstAriaLabel: 'Primera página',
                  firstTooltip: 'Primera página',
                  labelDisplayedRows: '{from}-{to} de {count}',
                  labelRowsPerPage: 'Filas por página:',
                  labelRowsSelect: 'filas',
                  lastAriaLabel: 'Ultima página',
                  lastTooltip: 'Ultima página',
                  nextAriaLabel: 'Pagina siguiente',
                  nextTooltip: 'Pagina siguiente',
                  previousAriaLabel: 'Pagina anterior',
                  previousTooltip: 'Pagina anterior',
                },
                toolbar: {
                  addRemoveColumns: 'Agregar o eliminar columnas',
                  exportAriaLabel: 'Exportar',
                  exportName: 'Exportar a CSV',
                  exportTitle: 'Exportar',
                  nRowsSelected: '{0} filas seleccionadas',
                  searchPlaceholder: 'Buscar',
                  searchTooltip: 'Buscar',
                  showColumnsAriaLabel: 'Mostrar columnas',
                  showColumnsTitle: 'Mostrar columnas',
                }
              }} />
         
        </div>
        </Container></>
        
        
      
    );
}


export default Menu;