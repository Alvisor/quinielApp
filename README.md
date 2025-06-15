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

Torneos finalizados: Un torneo marcado como finalizado (todos los partidos tienen resultado) ya no cuenta como activo. Esto implica:

Esos torneos no aparecerán como opción para crear nuevos grupos (no tendría sentido iniciar una quiniela de algo ya concluido).

No se puede uno unir a un grupo de un torneo que ya terminó (aunque el grupo en sí podría seguir visible para consultar resultados). Podríamos archivar o congelar grupos una vez termine el torneo: ya no se permiten pronósticos ni nuevos miembros, pero sí se mantiene la tabla final de posiciones para referencia.

Para los cálculos de límite de grupos activos por usuario, los grupos cuyos torneos finalizaron podrían no contarse, permitiendo al usuario crear/join nuevas quinielas en nuevos torneos sin verse limitado por las pasadas. De esta forma, después del Mundial de Clubes 2025, un usuario podría liberar ese "espacio" de grupo y usarlo para, digamos, un grupo del Mundial 2026.



Debilidad potencial: La regla de "hasta 4 partidos" puede ser arbitraria y frustrar a usuarios legítimos que descubren tarde la plataforma. Una alternativa podría ser permitir unirse en cualquier momento pero empezando con 0 puntos (quedando casi sin chance de ganar si llegan muy tarde), lo cual ya de por sí desincentiva entradas tardías sin bloquearlas totalmente. Esta decisión de diseño podría revisarse tras el MVP según la reacción de los usuarios. Igualmente, los límites de grupos podrían variarse en eventos futuros o eliminarse si no representan un problema práctico.

Stack Tecnológico Sugerido (Backend y Base de Datos)

Dado que el backend será en Node.js (requisito confirmado), se propondrá una pila tecnológica centrada en el ecosistema JavaScript, complementada con una base de datos robusta y servicios externos según necesidad:

- **Framework**: Node.js con Express, o preferentemente NestJS para una arquitectura modular.
- **Lenguaje**: se recomienda TypeScript para aprovechar tipado estático y mejorar el mantenimiento del código.
- **Base de datos**: PostgreSQL como motor relacional robusto y ampliamente soportado.
- **ORM y migraciones**: puede emplearse Prisma o TypeORM para modelar entidades y ejecutar consultas de manera sencilla; ambos ofrecen herramientas de migraciones (Prisma Migrate o TypeORM migrations) para versionar el esquema.

### Backend stub

Un servidor Express mínimo en `index.js` muestra el modelo `Torneo` con un flag `scoringLocked`. Los parámetros de puntaje pueden modificarse mediante `PATCH /torneos/:id/scoring` solo si el torneo no ha iniciado y la bandera continúa en `false`.

