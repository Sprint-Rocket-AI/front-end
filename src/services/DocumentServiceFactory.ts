import { DocumentTipoEnum } from "../modules/context-builder/interfaces/DocumentTipoEnum";
import { DocumentoDDLService } from "./DocumentoDDLService";
import { DocumentoNegocioService } from "./DocumentoNegocioService";
import { DocumentoSistemaService } from "./DocumentoSistemaService";
import { DocumentoLineamientoService } from "./DocumentoLineamientoService";

export const DocumentServiceFactory = {
  getDocumentServiceByType: (tipo: DocumentTipoEnum) => {
    switch (tipo) {
      case DocumentTipoEnum.DDL:
        return DocumentoDDLService;
      case DocumentTipoEnum.NEGOCIO:
        return DocumentoNegocioService;
      case DocumentTipoEnum.SISTEMA:
        return DocumentoSistemaService;
      case DocumentTipoEnum.LINEAMIENTO:
        return DocumentoLineamientoService;
      default:
        throw new Error(`Tipo de documento no soportado: ${tipo}`);
    }
  },
};
