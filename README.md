# quinielApp
Plan de Desarrollo para Aplicación Web de Quinielas de Fútbol

Descripción General del Proyecto

El proyecto consiste en una aplicación web para quinielas de fútbol entre amigos, es decir, apuestas amistosas donde los participantes pronostican resultados de partidos y compiten por puntos. Se busca desarrollar un Producto Mínimo Viable (MVP) funcional que permita a un grupo cerrado de usuarios crear sus propias ligas de predicciones durante un torneo de fútbol específico. La aplicación enfocará en la experiencia social (crear grupos privados, invitar amigos) más que en apuestas con dinero real, aunque se considerarán lineamientos para una posible monetización futura. A continuación se describen los requisitos principales del MVP, la arquitectura técnica sugerida, un análisis crítico del diseño y un plan de evolución por fases, todo presentado en un formato accesible para un desarrollador intermedio.

Funcionalidades del MVP

El MVP incluirá las siguientes características esenciales, basadas en los requisitos proporcionados:

Registro de usuarios y verificación

Registro con email y teléfono: Los usuarios se registrarán proporcionando un correo electrónico y un número de celular. Estos datos se almacenarán en la base de datos de usuarios.

Verificación de email (obligatoria): Al registrarse, el sistema enviará un correo de confirmación con un enlace o código para validar la dirección de email antes de permitir el acceso completo. Esto garantiza que cada cuenta esté vinculada a un email real.

Verificación de teléfono (opcional/MVP): Se plantea la integración con APIs de mensajería para verificar también el número de celular. Por ejemplo, se puede usar Twilio Verify, un servicio que soporta el envío de códigos OTP por SMS o WhatsApp. En el MVP, podría implementarse enviando un código vía SMS o WhatsApp al teléfono proporcionado y solicitando al usuario ingresarlo para confirmar su número. Esta capa agrega seguridad (evita cuentas falsas) y habilita futuras notificaciones vía WhatsApp/SMS.

Integración con proveedores: Para implementar lo anterior, se recomienda usar servicios externos en lugar de construir desde cero. SendGrid o AWS SES pueden utilizarse para el envío de correos de verificación, y Twilio (API de WhatsApp o SMS) para los códigos de celular. Estas herramientas manejan el entregamiento de mensajes y ofrecen SDKs sencillos para Node.js.


Debilidad potencial: la doble verificación (email y celular) puede aumentar la fricción en el registro. Si el MVP requiere rapidez, se podría lanzar inicialmente solo con verificación de email obligatoria y añadir la de teléfono en una fase posterior. En cualquier caso, es importante almacenar los contactos de forma segura (ej. emails en texto plano para login pero contraseñas hasheadas, y teléfonos en formato estandarizado) y cumplir normas de privacidad al manejar datos personales.

Creación y gestión de grupos de quiniela

Creación de grupos: Un usuario autenticado podrá crear un grupo de quiniela, actuando como administrador de ese grupo. Al crear un grupo, deberá asociarlo a un torneo específico (por ejemplo, "Mundial de Clubes FIFA 2025") que esté cargado en la base de datos. Cada grupo corresponde a un único torneo; esto simplifica la lógica ya que las predicciones de un grupo se refieren todas a los partidos de ese torneo.

Invitaciones mediante código único: Tras crear el grupo, la aplicación generará un código de invitación único (p. ej., un alfanumérico corto) que el administrador podrá compartir con sus amigos. Los usuarios podrán unirse al grupo ingresando este código en la app. Alternativamente, se puede implementar un enlace de invitación que incluya el código para mayor facilidad de uso (ej. https://miquiniela.app/invitacion/ABC123).

Unirse a grupos existentes: Cualquier usuario registrado puede unirse a un grupo introduciendo el código de invitación, siempre que cumpla ciertas condiciones: (a) el grupo no haya alcanzado el límite de participantes, si es que definimos uno; (b) el torneo asociado al grupo esté activo y no demasiado avanzado (ver restricciones más abajo). Al unirse, el usuario comenzará con 0 puntos en ese grupo y podrá hacer sus pronósticos para los partidos pendientes.

Gestión básica del grupo: El creador (admin) del grupo debería tener opciones para editar detalles del grupo (nombre, descripción) y posiblemente expulsar participantes en caso necesario (por ejemplo, si alguien entró por error). Sin embargo, en un MVP estas funcionalidades administrativas pueden ser limitadas. No se contempla la creación de subgrupos ni cambios de torneo una vez creado el grupo.

Límite de grupos: Para prevenir abuso, se establecerán límites como: cada usuario puede crear un número máximo de grupos (por ejemplo, 3 grupos) y participar en hasta X grupos ajenos (por ejemplo, unirse a 5 grupos como tope). Estas cotas aseguran que un usuario no cree o se una a decenas de quinielas, manteniendo el enfoque en círculos de amigos cercanos. Son parámetros de negocio que podrían ajustarse según feedback.


Debilidad potencial: definir los límites de grupos por usuario requiere entender el comportamiento real de los usuarios. Un límite muy bajo podría impedir casos de uso legítimos (ej. alguien quiere un grupo con familia, otro con colegas, otro con amigos), pero un límite muy alto hace irrelevante la restricción. Una mejora futura podría ser ajustar dinámicamente o permitir más grupos previo permiso especial. Otra consideración es la moderación: en este MVP no hay muchas herramientas para contenido inapropiado en nombres de grupo, pero dado que son grupos privados de amigos, no se espera un gran problema inicial.

Torneos y calendario de partidos

Base de datos de torneos y equipos: El sistema deberá contar con información pre-cargada de los torneos soportados. Para el MVP, se puede comenzar con un solo torneo de ejemplo, por ejemplo el Mundial de Clubes de la FIFA 2025, con todos sus equipos y partidos. En la base de datos habrá una entidad Torneo (con campos como nombre, año, fechas de inicio/fin, estado activo o finalizado, etc.) y una entidad Equipo (nombre del club/selección, quizá bandera o logo URL, etc.). También habrá una tabla de Partidos, que incluye el identificador del torneo, equipos locales y visitantes, fecha y hora programada, y campos para el resultado una vez conocido (goles local, goles visitante).

Carga inicial de datos: Para poblar la información del torneo y partidos, el MVP puede optar por scraping de alguna fuente pública o mejor aún usar una API gratuita de deportes. Dado que es un entorno de prueba, incluso se podría ingresar manualmente un archivo CSV/JSON con el calendario. Sin embargo, se recomienda integrar una fuente automatizada para evitar errores manuales. Existen APIs deportivas gratuitas o de bajo costo para obtener resultados y horarios en vivo, como API-FOOTBALL o Sports Open Data, que podrían utilizarse para obtener los datos del Mundial de Clubes 2025 (equipos participantes, fechas de los partidos y posteriormente resultados). En caso de optar por web scraping, habría que identificar una página oficial (por ejemplo, la web de FIFA o Wikipedia) y extraer la información de partidos; esto requiere cuidado con cambios de formato y posibles restricciones de la página.

Actualizaciones de partidos: Todos los partidos de un torneo se cargan inicialmente con estado "pendiente" y sin resultado. La aplicación debe actualizar el resultado real de cada partido una vez concluido. Esto puede lograrse de dos maneras: (a) mediante llamadas periódicas a la API de datos deportivos para obtener marcadores finales (por ejemplo, cada 5 minutos consultar la API para partidos en curso o recientes), o (b) implementando webhooks o suscripciones si la API lo ofrece, para recibir notificaciones cuando termine un partido. En un MVP, una tarea programada (cron job) que corra en el servidor y consulte resultados puede ser suficiente. Otra opción es facilitar una interfaz de administrador interno donde manualmente se puedan ingresar los resultados finalizados, aunque esto último podría ser propenso a errores si no se automatiza.

Asociación grupo-torneo: Como se mencionó, cada grupo está ligado a un torneo específico. Esto significa que cuando los usuarios en un grupo vean la lista de partidos, solo verán los de ese torneo. También implica que las predicciones de los usuarios estarán vinculadas a partidos de un torneo dado. (Nota: si en el futuro se soportan ligas largas como Champions League o una liga local, la estructura sigue igual; simplemente el torneo dura más tiempo y tiene más partidos).


Debilidad potencial: depender de una API gratuita puede introducir limitaciones (p. ej., límites de llamadas por minuto, datos incompletos o retrasos). El scraping, por su parte, es frágil ante cambios en la fuente. Una mejora en fases posteriores sería migrar a APIs más robustas o de pago si la base de usuarios crece, o establecer un caché de resultados para minimizar llamadas. También es importante manejar correctamente zonas horarias en los horarios de partidos, asegurando que la hora almacenada sea consistente (idealmente en UTC) y luego convertida al huso local para despliegue, para calcular correctamente los cortes de pronósticos (ej. 30 minutos antes).

Gestión de pronósticos de partidos

Ingreso de pronósticos: Dentro de cada grupo, cada participante podrá predecir el marcador de cada partido del torneo asociado. La interfaz listará los partidos (ej. con fecha/hora, equipos) y permitirá ingresar goles pronosticados para local y visitante. El diseño debe permitir guardar predicciones incrementalmemente (no es necesario llenar todos de una vez; se pueden ir haciendo a medida que avanzan las fechas).

Fecha límite de pronóstico: Una regla clave es que los usuarios solo pueden ingresar o editar un pronóstico hasta 30 minutos antes del inicio de cada partido. Esto significa que el backend debe validar la hora actual contra la hora programada del partido. Si un usuario intenta enviar o editar un pronóstico con menos de 30 minutos de anticipación, la solicitud será rechazada. Esta restricción evita trampas de último minuto con información de alineaciones u otros factores.

Bloqueo al inicio del partido: Una vez que el partido ha comenzado (hora de inicio pasada), el sistema debe bloquear inmediatamente cualquier modificación o ingreso tardío de pronóstico para ese partido. En la base de datos, podemos representar esto marcando la predicción como cerrada o simplemente omitiendo cualquier lógica de escritura si now() > match.start_time - 30min. Es recomendable implementar esto tanto en el frontend (deshabilitando el formulario a tiempo) como, especialmente, en el backend para seguridad.

Almacenamiento de predicciones: Las predicciones de usuarios se guardarán en una tabla (o colección) de Predicciones, que típicamente contiene: ID de usuario, ID de partido, ID de grupo (o derivable via partido->torneo->grupo), goles pronosticados local, goles pronosticados visitante, timestamp de cuándo se hizo la predicción (útil para auditoría) y quizá un flag de cerrado/no editable. Esta tabla puede llegar a ser voluminosa (un registro por usuario por partido), por lo que es importante indexarla apropiadamente (índices por partido y por usuario) para consultas eficientes, por ejemplo al calcular puntos.


Debilidad potencial: asegurar la sincronización de tiempo es crítico. Se debe asumir que el servidor tiene la hora correcta (considerar usar UTC internamente). Una mejora posible es implementar un reloj centralizado o servicio de tiempo para evitar dependencias de la hora del dispositivo cliente. También, si partidos se retrasan o adelantan, habría que actualizar la hora de inicio en el sistema; en esos casos, las reglas de "30 minutos antes" deben adaptarse (posiblemente reabrir pronósticos si un partido se pospone horas/días). Un cron could re-evaluate upcoming matches schedule periodically.

Cálculo de puntuaciones y posiciones

Reglas de puntuación: Para fomentar la competencia, se otorgan puntos por cada pronóstico acertado según varios niveles de precisión:

Marcador exacto acertado: Si el usuario predijo exactamente los goles de ambos equipos como el resultado final real, recibe 3 puntos (máxima puntuación).

Diferencia de goles acertada: Si el usuario no acierta el marcador exacto, pero sí acierta la diferencia de goles y el resultado (ganador/empate), podría recibir 2 puntos. Por ejemplo, si el resultado real es 2-0 (diferencia de 2 goles a favor del local) y el usuario pronosticó 3-1 (diferencia de 2 goles a favor del local), no es marcador exacto pero sí coincidió en que el local ganaba por 2 de diferencia, otorgando 2 puntos. En el caso de un empate, "diferencia de goles 0" equivale a acertar que empataron sin acertar el marcador exacto.

Ganador/empate acertado (sin diferencia): Si el usuario acierta solo el ganador (o acierta que es empate) pero no el marcador ni la diferencia de goles exacta, obtiene 1 punto. Ejemplo: resultado real 1-0, pronóstico 3-2 (usuario acierta que gana el local, pero diferencia distinta); resultado real 1-1, pronóstico 2-2 (acierta que empatan pero no el marcador exacto).

Fallo total: Si el pronóstico no acertó ni el ganador/empate (ej. apostó por el equipo contrario o predijo empate y no lo fue), recibe 0 puntos.


> Nota: Las reglas anteriores son configurables; lo importante es que el sistema pueda soportar este cálculo de forma automatizada tras cada partido. Un esquema común en quinielas es 3 puntos por acierto pleno y 1 por acierto de ganador, pero aquí incorporamos 2 puntos por acertar diferencia de goles para agregar matices.



Cómputo automático de puntos: Una vez finalizado un partido y cargado el resultado real en el sistema, se debe desencadenar la evaluación de todas las predicciones asociadas a ese partido, en todos los grupos en que esté presente (en la práctica, el mismo partido puede existir en múltiples grupos si hay varios grupos del mismo torneo). Para cada predicción, el algoritmo asignará los puntos según las reglas anteriores y marcará esa predicción como "calificada". Estos puntos se suman al total acumulado del usuario en el grupo correspondiente.

Tabla de posiciones por grupo: La aplicación mantendrá, para cada grupo, una clasificación de usuarios según sus puntos acumulados. Esta tabla de posiciones se actualizará dinámicamente conforme avancen los partidos. El usuario con más puntos lidera la tabla, etc. En cualquier momento, los participantes deben poder ver esta clasificación y cuántos puntos lleva cada jugador del grupo (posiblemente mostrando también cuántos aciertos exactos ha tenido cada uno, como dato adicional entretenido).

Para mantener esta tabla, podemos calcular los totales "on the fly" sumando las predicciones acertadas, o almacenar un campo acumulado por usuario-por-grupo que se actualiza cada vez que se otorgan puntos nuevos. Una opción eficiente es calcular los totales mediante consultas agregadas SQL cuando se necesite (dado que las tablas no serán gigantes en un entorno de amigos), pero almacenar los totales en una tabla aparte (ej. Tabla Posiciones con user_id, group_id, puntos) puede simplificar la consulta de ranking. Esta tabla de posiciones se puede recalcular completamente tras cada partido, o actualizar incrementalmente por cada usuario afectado.

Desempates: (Fuera del alcance estricto del MVP, pero a considerar) Si al final del torneo varios jugadores empatan en puntos, el sistema podría desempatar por criterios adicionales (p. ej., quien tenga más pronósticos exactos, o alguna regla definida por el grupo). Inicialmente, el MVP puede simplemente declarar empate entre jugadores si ocurre, o destacar a ambos como ganadores.


La importancia de una tabla de posiciones bien diseñada se destaca en proyectos similares: es deseable que el sistema liste a todos los jugadores y los clasifique según sus aciertos/puntos acumulados. Esto mantiene la competitividad y transparencia dentro de cada grupo.

Restricciones adicionales de participación

Ingreso tardío a torneo activo: Para mantener la competencia justa, se restringirá la entrada de nuevos participantes a un grupo una vez que el torneo esté muy avanzado. La regla propuesta es no permitir unirse si ya se han disputado más de 4 partidos del torneo. En otras palabras, hasta el cuarto partido (inclusive) aún se podría entrar, asumiendo que quien entra tarde no pudo pronosticar los partidos anteriores (obtendría 0 puntos en ellos, desventaja manejable). Después de ese umbral, el sistema rechazaría nuevos ingresos al grupo con un mensaje del tipo "El torneo ya está avanzado; no es posible unirse en este punto". Este valor (4 partidos) podría ajustarse según el tamaño típico del torneo; para torneos muy cortos (ej. 7 partidos como el Mundial de Clubes) quizá 4 es razonable, para torneos largos (ej. liga con 380 partidos) se podría permitir más flexibilidad. En MVP usaremos la regla dada de 4 partidos.

Cantidad máxima de grupos: (Mencionado previamente) cada usuario tendrá un límite en cuántos grupos puede crear y en cuántos puede estar participando simultáneamente. Por ejemplo, un usuario puede crear hasta 3 grupos y unirse (como no-creador) hasta en 5 grupos de otros. Estas constantes se definen para prevenir abuso y para limitar la carga del sistema por usuario en escenarios iniciales. También impide que un solo usuario se disperse en demasiados grupos, lo que en contexto de MVP no es necesario. En fases futuras, si se incrementa la capacidad, se podrían relajar estos límites o ofrecer ampliaciones premium.

Torneos finalizados: Un torneo marcado como finalizado (todos los partidos tienen resultado) ya no cuenta como activo. Esto implica:

Esos torneos no aparecerán como opción para crear nuevos grupos (no tendría sentido iniciar una quiniela de algo ya concluido).

No se puede uno unir a un grupo de un torneo que ya terminó (aunque el grupo en sí podría seguir visible para consultar resultados). Podríamos archivar o congelar grupos una vez termine el torneo: ya no se permiten pronósticos ni nuevos miembros, pero sí se mantiene la tabla final de posiciones para referencia.

Para los cálculos de límite de grupos activos por usuario, los grupos cuyos torneos finalizaron podrían no contarse, permitiendo al usuario crear/join nuevas quinielas en nuevos torneos sin verse limitado por las pasadas. De esta forma, después del Mundial de Clubes 2025, un usuario podría liberar ese "espacio" de grupo y usarlo para, digamos, un grupo del Mundial 2026.



Debilidad potencial: La regla de "hasta 4 partidos" puede ser arbitraria y frustrar a usuarios legítimos que descubren tarde la plataforma. Una alternativa podría ser permitir unirse en cualquier momento pero empezando con 0 puntos (quedando casi sin chance de ganar si llegan muy tarde), lo cual ya de por sí desincentiva entradas tardías sin bloquearlas totalmente. Esta decisión de diseño podría revisarse tras el MVP según la reacción de los usuarios. Igualmente, los límites de grupos podrían variarse en eventos futuros o eliminarse si no representan un problema práctico.

Stack Tecnológico Sugerido (Backend y Base de Datos)

Dado que el backend será en Node.js (requisito confirmado), se propondrá una pila tecnológica centrada en el ecosistema JavaScript, complementada con una base de datos robusta y servicios externos según necesidad:

