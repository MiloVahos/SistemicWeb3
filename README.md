# SISTEMIC PUBLICATIONS WEB APP

## BREVE DESCRIPCIÓN DEL PROYECTO
Este proyecto es un CRUD desarrollado usando Angular Cli 6.0.8, Firebase 5.3.1 y Bootstrap 4.1.3, el proyecto se encarga de la administración de la base de datos de publicaciones del grupo de investigación SISTEMIC, el proyecto se puede considerar con las siguientes características en esta versión:

1. En el frente del proyecto, un usuario cualquiera puede realizar consultas en cada uno de los tipos de    documentos que el grupo de investigación produce, puede usar los filtros globales y los filtros          especializados para consultar la información que desee.
2. Un usuario que tenga credenciales de acceso podrá hacerlo para ingresar a la zona de administración,
   en dicha zona podra actualizar, borrar o ingresar nuevas entradas a cada uno de los tipos de documentos.

### MATERIAL POR APRENDER
- ANGULAR 2 EN ADELANTE: Para ello el grupo tiene un curso en Udemy que podrás acceder para aprender todo lo necesario de Angular.
- Bootstrap: Es muy sencillo, en la misma documentación encontrarás todo lo necesario https://getbootstrap.com/
- Firebase: Igual al anterior, con la documentación y un poco de conocimientos previos en bases de datos NoSQL, además de usar la librería de soporte https://github.com/angular/angularfire2
- Podras observar que hay otras librerías que se usan como ng-bootstrap, estas librerías que han sido usadas para objetivos muy específicos no es necesario que las aprendas porque estan basadas en angular y bootstrap.

### TODO
1. La app tiene un problema de "eficiencia" debido a una mala practica que utilicé, la idea es aplicar la buena práctica recomendada, en el momento cada módulo se encarga de hacer sus propias consultas e interacciones con la base datos, la idea es migrar todo esto a SERVICIOS que puedan ser consumidos por los módulos, y que en ellos solo queden las tareas para mostrar dichos datos. Para ello, recomiendo aprender en profundidad RxJS, librería necesaria para poder hacer bien dicha interacción entre los servicios y los módulos dado que angularfire está basada en dicha librería.
2. HACER PIPES PERSONALIZADOS A CADA TIPO DE DOCUMENTO
4. AÑADIR VALIDACIÓN PERSONALIZADA A LA LISTA DE AUTORES
6. AGREGAR UNA FORMA DE VER LOS AUTORES DEL GRUPO


_*Developer: Juan Camilo Peña Vahos - 2018*_