# En src/models/item_model.py
class UsuariosDelSistema(Base):
    __tablename__ = "usuarios"
    id_usuario: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str]
    pass_hash: Mapped[str]
    

class RolesDeUsuarios(Base):
    __tablename__ = "catalogo_rol"
    id_rol: Mapped[int] = mapped_column(primary_key=True)
    nombre_rol: Mapped[str]
    descripcion_rol: Mapped[str] 