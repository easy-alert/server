import { Response, Request } from 'express';
import { prisma } from '../../../prisma';

export async function fixSupplierAreaOfActivity(_req: Request, res: Response) {
  const json = `[
	{
		"id" : "ef8bab4b-3beb-48a0-a7db-222aa042f0a7",
		"name" : "Armando",
		"companyId" : "08c7703c-a893-4a4c-99b7-04c8cc0c76b7",
		"label" : "Acabamentos",
		"status" : "padrão"
	},
	{
		"id" : "ef8bab4b-3beb-48a0-a7db-222aa042f0a7",
		"name" : "Armando",
		"companyId" : "08c7703c-a893-4a4c-99b7-04c8cc0c76b7",
		"label" : "Gás",
		"status" : "padrão"
	},
	{
		"id" : "ef8bab4b-3beb-48a0-a7db-222aa042f0a7",
		"name" : "Armando",
		"companyId" : "08c7703c-a893-4a4c-99b7-04c8cc0c76b7",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "f5df0b1c-7297-4a45-83d2-cafa972dd0a7",
		"name" : "wmwm",
		"companyId" : "248573d2-5927-4ff1-aeff-4de8bf1144cb",
		"label" : "Acabamentos",
		"status" : "padrão"
	},
	{
		"id" : "f5df0b1c-7297-4a45-83d2-cafa972dd0a7",
		"name" : "wmwm",
		"companyId" : "248573d2-5927-4ff1-aeff-4de8bf1144cb",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "f5df0b1c-7297-4a45-83d2-cafa972dd0a7",
		"name" : "wmwm",
		"companyId" : "248573d2-5927-4ff1-aeff-4de8bf1144cb",
		"label" : "SPDA",
		"status" : "não padrão"
	},
	{
		"id" : "b90d774d-c04a-4f95-b3c1-ac7c48c59777",
		"name" : "Dibreva LTDA",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "8507d367-079a-458e-9ec9-7623ee0eaec7",
		"name" : "NK Dedetizadora",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Controle de pragas",
		"status" : "não padrão"
	},
	{
		"id" : "8507d367-079a-458e-9ec9-7623ee0eaec7",
		"name" : "NK Dedetizadora",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "8507d367-079a-458e-9ec9-7623ee0eaec7",
		"name" : "NK Dedetizadora",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "8507d367-079a-458e-9ec9-7623ee0eaec7",
		"name" : "NK Dedetizadora",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "117d4617-883d-4137-a290-4309e788d717",
		"name" : "Premium Serv",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Calhas",
		"status" : "não padrão"
	},
	{
		"id" : "117d4617-883d-4137-a290-4309e788d717",
		"name" : "Premium Serv",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Lavação de Fachada",
		"status" : "não padrão"
	},
	{
		"id" : "117d4617-883d-4137-a290-4309e788d717",
		"name" : "Premium Serv",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Pintura",
		"status" : "padrão"
	},
	{
		"id" : "117d4617-883d-4137-a290-4309e788d717",
		"name" : "Premium Serv",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Telhados",
		"status" : "não padrão"
	},
	{
		"id" : "4ed1feec-24f6-45e4-96e3-3be8bf97c4f0",
		"name" : " Timaco Tijolos Material de Construção Ltda.",
		"companyId" : "29be97ba-5e69-4ad2-97a7-6c8483433c03",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "f3e06b84-626d-4862-bc53-2ab808dc68ca",
		"name" : "ALEX - LOJA ASTURIAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "ef7f2ff6-6eea-4c5b-9bf2-845b771bc9d7",
		"name" : "ANTONIO - REFORMAR",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "ENCANADOR",
		"status" : "não padrão"
	},
	{
		"id" : "7ac3ee6f-b75f-4c36-9ab6-c726c73a645b",
		"name" : "ASSIST LITORAL ( RODRIGO)",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "CFTV/ANTENA/INTERFONE/PORTÃO AUTOMÁTICO",
		"status" : "não padrão"
	},
	{
		"id" : "25ce39aa-47a7-4f9b-8088-7f7479dc03a7",
		"name" : "DANIEL - DSD ENGENHARIA",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "0f547fc2-a179-4343-a71a-c5a0bcb7014a",
		"name" : "DOXA - FELIPE",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "CFTV/ANTENA/INTERFONE/PORTÃO AUTOMÁTICO",
		"status" : "não padrão"
	},
	{
		"id" : "b833c55d-dcb0-4d5a-998d-1971fee06faf",
		"name" : "EBENEZER - GUILHERME",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "31c096c4-ff15-46d2-916f-394514a9957c",
		"name" : "FABIO EFFORT ENGENHARIA ELETRICA",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "31c096c4-ff15-46d2-916f-394514a9957c",
		"name" : "FABIO EFFORT ENGENHARIA ELETRICA",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "SPDA",
		"status" : "não padrão"
	},
	{
		"id" : "95caab8c-ce4d-4462-b43f-c766fac52495",
		"name" : "FLAVIO ",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "ENCANADOR",
		"status" : "não padrão"
	},
	{
		"id" : "71e642f0-f644-4483-a95f-ec0309a92b1f",
		"name" : "GUARUJÁ MADEIRAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "MADEIREIRA",
		"status" : "não padrão"
	},
	{
		"id" : "aa6d6d12-aa7d-4483-a67f-04b523b836c4",
		"name" : "GUARU TINTAS FERRY BOAT",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "TINTAS",
		"status" : "não padrão"
	},
	{
		"id" : "59ae4978-adbc-452d-90ce-2226f6639384",
		"name" : "MAYCON - BARATÃO DAS TINTAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "TINTAS",
		"status" : "não padrão"
	},
	{
		"id" : "37544a05-377e-425e-8285-1f9fbe01825c",
		"name" : "POMPEIA - EMPREITEIRA",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "5406d90f-9654-4e32-bfd1-633e5c46211a",
		"name" : "RONY - SPRINGER ENERGY",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Cerca elétrica",
		"status" : "não padrão"
	},
	{
		"id" : "5406d90f-9654-4e32-bfd1-633e5c46211a",
		"name" : "RONY - SPRINGER ENERGY",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "693b7add-4aaf-4bcd-b691-1b0e63077e62",
		"name" : "SILVIO - TOP BOMBAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "BOMBAS HIDRAULICAS",
		"status" : "não padrão"
	},
	{
		"id" : "693b7add-4aaf-4bcd-b691-1b0e63077e62",
		"name" : "SILVIO - TOP BOMBAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "QUADRO DE BOMBAS",
		"status" : "não padrão"
	},
	{
		"id" : "e83e16e3-9fd4-4ffb-b6c2-f15ba54010b4",
		"name" : "TINTAS MC",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "TINTAS",
		"status" : "não padrão"
	},
	{
		"id" : "39cc9ddd-f0e9-4db7-a2e5-c8b6f87ee75f",
		"name" : "TINTAS MC - TIAGO",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "TINTAS",
		"status" : "não padrão"
	},
	{
		"id" : "21aec62c-d4fa-439f-8ea0-90a48dc97d91",
		"name" : "TINTAS SÃO MIGUEL - ANA",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "TINTAS",
		"status" : "não padrão"
	},
	{
		"id" : "ead36816-c332-4cd2-8a0f-d6407178d65f",
		"name" : "TONY - RTT",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "6d6f1699-ca20-43b5-95c8-b09bf9fd2b43",
		"name" : "USEBOMBAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "BOMBAS HIDRAULICAS",
		"status" : "não padrão"
	},
	{
		"id" : "4f16babd-8d73-4903-b751-edda90ddc06b",
		"name" : "VITORIA - COUTO ",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "ec1d5053-8b94-4364-ae68-25ae599ee582",
		"name" : "VITOR- VD INSTALAÇÕES",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "e2ee05e4-46b3-411d-b261-96a4290b7cd4",
		"name" : "WANDO - ENCANADOR",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "ENCANADOR",
		"status" : "não padrão"
	},
	{
		"id" : "a1626b50-65fd-4b69-9814-2f45dd3af0fc",
		"name" : "ZAZ TRAZ - BOMBAS",
		"companyId" : "3f87f5ee-7380-40f8-9990-13ea380a18fa",
		"label" : "BOMBAS HIDRAULICAS",
		"status" : "não padrão"
	},
	{
		"id" : "272d2672-0d50-48d9-838b-26d833d0ff4f",
		"name" : "AQUAPHARMA",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Análise de água",
		"status" : "não padrão"
	},
	{
		"id" : "717ae502-7eb7-49ec-90fb-517d107cc82d",
		"name" : "DEMA REYLUX",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "f161bea0-34f8-4a6d-ac8a-c92b71d06a7e",
		"name" : "FABIO JÚNIOR ",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Segurança Eletrônica",
		"status" : "não padrão"
	},
	{
		"id" : "1f2beee7-0970-4a7d-a43a-face06563360",
		"name" : "FABRICIO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "801469b7-5a21-44af-9440-3036f4dbd97a",
		"name" : "HOMELAR",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "6e74d604-566e-4d4e-8e17-a13f63fabe03",
		"name" : "HOMELAR",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "d2e76035-39dd-4126-9ae4-d6890d9c5840",
		"name" : "JENIVAL (FIAÇO)",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "ee4df1ad-7c34-4d11-9fd6-099bcf9f021d",
		"name" : "JF PARAFUSO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "2ff2bcd2-5891-4877-90c6-77d285a7a1d2",
		"name" : "JULIANO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "9e251563-fb5b-4a41-9020-0653fe3cce0b",
		"name" : "LAERCIO CALCETEIRO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Calceteiro",
		"status" : "não padrão"
	},
	{
		"id" : "38741755-3884-4793-9958-93c876398252",
		"name" : "LEANDRO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Segurança Eletrônica",
		"status" : "não padrão"
	},
	{
		"id" : "35db9694-0165-48d5-9cf2-02fda7c773c0",
		"name" : "LIMPEZA DE FOSSA E DEDETIZADORA E PISA NA BARATA ",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "5c85b206-30c6-4589-9b21-30a0010899d0",
		"name" : "LOJA ALFA LUZ",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "a985127c-4def-4c86-893e-ec3f7165ea20",
		"name" : "LUCIANO VIDRAÇARIA",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Vidracaria",
		"status" : "não padrão"
	},
	{
		"id" : "ca791f5f-c50e-45ee-8742-d163be4abf0e",
		"name" : "MASTER CONTROLE DE PRAGAS",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Controle de pragas",
		"status" : "não padrão"
	},
	{
		"id" : "faaeb96b-8048-4244-8c49-1c98f42ede2c",
		"name" : "MINAS MOTORES",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Manutenção de motores",
		"status" : "não padrão"
	},
	{
		"id" : "cef879f0-8fbc-4cc6-8096-10de825f17a3",
		"name" : "NOEL",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Serralheria em geral",
		"status" : "não padrão"
	},
	{
		"id" : "d05fef71-a9a3-490c-b09f-365f34b1596d",
		"name" : "POPULAR MATERIAL ",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "62b74a9c-4f8d-40dc-a745-91c971b7a1e1",
		"name" : "PORTO PSCINA ",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Produtos piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "deb30d38-c732-44d7-b0fd-656c3ab7659b",
		"name" : "PREV INCENDIO  ",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Extintores",
		"status" : "não padrão"
	},
	{
		"id" : "a0e69837-e58d-45f8-a887-8cecd2a0864f",
		"name" : "RIZZOLAR",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "598058e8-e209-4f38-aae6-215d2a1637db",
		"name" : "RODRIGO CALEBE",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Gráfica",
		"status" : "não padrão"
	},
	{
		"id" : "4f7f6f5c-6bcc-4c88-993a-82111d80868a",
		"name" : "SÃO SEBASTIÃO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Análise de água",
		"status" : "não padrão"
	},
	{
		"id" : "3dc563ea-5666-41f4-b209-b79b115d0752",
		"name" : "STYLO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "6fd4440d-ae3c-47aa-a254-537fe4d3cf24",
		"name" : "TEK FILTRO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Produtos piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "5013d07e-3166-42b7-b211-0379401e1edc",
		"name" : "VAGNER CONSTRUTOR",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Construtor",
		"status" : "não padrão"
	},
	{
		"id" : "98ac4bde-3661-422d-b6e0-697b0eee5e4a",
		"name" : "ZÉ DO POÇO",
		"companyId" : "6693789b-bdaa-4cbe-9c8e-f16c3ebee9e4",
		"label" : "Poço",
		"status" : "não padrão"
	},
	{
		"id" : "40ad2cef-48b2-4c4a-9d2d-739e8ba127ab",
		"name" : "Intelcom Soluções",
		"companyId" : "6b511358-8f2c-4e6c-8fa3-2f10807c4826",
		"label" : "Câmeras",
		"status" : "não padrão"
	},
	{
		"id" : "40ad2cef-48b2-4c4a-9d2d-739e8ba127ab",
		"name" : "Intelcom Soluções",
		"companyId" : "6b511358-8f2c-4e6c-8fa3-2f10807c4826",
		"label" : "CFTV/ANTENA/INTERFONE/PORTÃO AUTOMÁTICO",
		"status" : "não padrão"
	},
	{
		"id" : "40ad2cef-48b2-4c4a-9d2d-739e8ba127ab",
		"name" : "Intelcom Soluções",
		"companyId" : "6b511358-8f2c-4e6c-8fa3-2f10807c4826",
		"label" : "Informatica",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza cisterna",
		"status" : "não padrão"
	},
	{
		"id" : "a2e56680-8eba-4674-afb8-84ea4d037858",
		"name" : "ABM AMBIENTAL DESENTUPIDORA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "69c49e80-f26f-4d3b-915f-74e855c2d124",
		"name" : "ADELIR DE PROENCA SERRALHERIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Cobertura de garagens",
		"status" : "não padrão"
	},
	{
		"id" : "69c49e80-f26f-4d3b-915f-74e855c2d124",
		"name" : "ADELIR DE PROENCA SERRALHERIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Grades",
		"status" : "não padrão"
	},
	{
		"id" : "69c49e80-f26f-4d3b-915f-74e855c2d124",
		"name" : "ADELIR DE PROENCA SERRALHERIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Portas",
		"status" : "não padrão"
	},
	{
		"id" : "69c49e80-f26f-4d3b-915f-74e855c2d124",
		"name" : "ADELIR DE PROENCA SERRALHERIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Portões",
		"status" : "não padrão"
	},
	{
		"id" : "69c49e80-f26f-4d3b-915f-74e855c2d124",
		"name" : "ADELIR DE PROENCA SERRALHERIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Serralheria em geral",
		"status" : "não padrão"
	},
	{
		"id" : "1d1b0b29-dcb6-49d1-aad2-a583f79ad3e3",
		"name" : "ADMINISTRA GESTÃO DE CONDOMINIOS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "78e3c5fe-9acd-403f-a531-36119eb99913",
		"name" : "ADV - MORGANA SCHOENAU DA SILVA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Consultoria Jurídica",
		"status" : "não padrão"
	},
	{
		"id" : "0c932e0a-a8de-4f82-aed3-eca208626c5e",
		"name" : "ÁGILE ADMINISTRADORA DE CONDOMINIOS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "14bf7358-3a56-483d-b4fe-4704f3fc47a6",
		"name" : "AGIL PINTURAS EIRELI",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pintura",
		"status" : "padrão"
	},
	{
		"id" : "9ffc3f63-9cb3-417f-87a7-dfbc55ad36f1",
		"name" : "AGUIAR SUL ATACADO EM PISCINAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Manutenção em piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "9ffc3f63-9cb3-417f-87a7-dfbc55ad36f1",
		"name" : "AGUIAR SUL ATACADO EM PISCINAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Produtos piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "a12da573-62fa-4286-b4fd-e1ad62164749",
		"name" : "AS ENCANADOR HIDRAULICA LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza cisterna",
		"status" : "não padrão"
	},
	{
		"id" : "fd0428b7-3417-456b-bc72-f4792ca8c4f7",
		"name" : "ATAK DEDETIZAÇÃO ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "37966a12-4e98-4b83-9a78-eea09d8183f9",
		"name" : "ATHOS SOLUÇOES EM SERVIÇOS TERCEIRIZADOS-EIRELI-ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Serviço de limpeza",
		"status" : "não padrão"
	},
	{
		"id" : "b85db845-4e57-4706-b6e3-b8d938feb378",
		"name" : "AUTENTICLEAN COMERCIO LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Produtos de limpeza",
		"status" : "não padrão"
	},
	{
		"id" : "a506d1da-80a2-4e0b-8c6f-592e4d5df8e3",
		"name" : "BALAROTI MATERIAIS DE CONSTRUÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "e722c0ba-a279-4f5b-aeba-cc3a76d2bfb3",
		"name" : "BARNI MATERIAL DE CONSTRUÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "40f34282-5dd6-405f-a9cd-52a99625bdb0",
		"name" : "BASE GÁS REGIONAL LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Distribuídora de gás",
		"status" : "não padrão"
	},
	{
		"id" : "56cdb904-196c-4543-8bb5-ef92fa3258c3",
		"name" : "Box blu esquadrias de alumínio Ltda epp",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Janelas e esquadrias",
		"status" : "não padrão"
	},
	{
		"id" : "942ac0db-c677-44b2-b428-c5e53f40cff9",
		"name" : "CENTRAL CHAVES",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Chaveiro",
		"status" : "não padrão"
	},
	{
		"id" : "2bb0381c-7701-401d-a29b-945d8c64a064",
		"name" : "CLEITON FABIANO SOTHE",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "BOMBAS HIDRAULICAS",
		"status" : "não padrão"
	},
	{
		"id" : "2bb0381c-7701-401d-a29b-945d8c64a064",
		"name" : "CLEITON FABIANO SOTHE",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "ENCANADOR",
		"status" : "não padrão"
	},
	{
		"id" : "2bb0381c-7701-401d-a29b-945d8c64a064",
		"name" : "CLEITON FABIANO SOTHE",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "26edf5b6-c3e2-447e-be5d-c1b6c5c1454d",
		"name" : "CONSTRUCOLOR COMERCIO DE TINTAS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "TINTAS",
		"status" : "não padrão"
	},
	{
		"id" : "e7600fec-dc9d-413f-98e6-92d521f76a50",
		"name" : "CONTAL CONTABILIDADE",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "e7600fec-dc9d-413f-98e6-92d521f76a50",
		"name" : "CONTAL CONTABILIDADE",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Contabilidade",
		"status" : "não padrão"
	},
	{
		"id" : "df0f151e-e75e-44db-94c9-9112d38c32c9",
		"name" : "D2 Administradora de Condomínios",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "9d802fe5-6f51-4462-ae5e-3782ecdd50ac",
		"name" : "DÁRIO -  PEDREIRO/CONSTRUÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pedreiro",
		"status" : "não padrão"
	},
	{
		"id" : "5fe2304a-30a1-4d3a-8981-008b10aa16ff",
		"name" : "DECIO EXTINTORES",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Extintores",
		"status" : "não padrão"
	},
	{
		"id" : "5fe2304a-30a1-4d3a-8981-008b10aa16ff",
		"name" : "DECIO EXTINTORES",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Mangueiras  de incêndio",
		"status" : "não padrão"
	},
	{
		"id" : "94b04d42-9cea-4ef5-b263-d13006dde1ec",
		"name" : "DEDEIZA DESISETIZAÇÕES LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "94b04d42-9cea-4ef5-b263-d13006dde1ec",
		"name" : "DEDEIZA DESISETIZAÇÕES LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "94b04d42-9cea-4ef5-b263-d13006dde1ec",
		"name" : "DEDEIZA DESISETIZAÇÕES LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "94b04d42-9cea-4ef5-b263-d13006dde1ec",
		"name" : "DEDEIZA DESISETIZAÇÕES LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "94b04d42-9cea-4ef5-b263-d13006dde1ec",
		"name" : "DEDEIZA DESISETIZAÇÕES LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "94b04d42-9cea-4ef5-b263-d13006dde1ec",
		"name" : "DEDEIZA DESISETIZAÇÕES LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "5273779d-db4d-4db6-b45d-e630e60f4ae2",
		"name" : "Disbracon Dist. de Materiais Elétricos e construção",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Distribuídora Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "5273779d-db4d-4db6-b45d-e630e60f4ae2",
		"name" : "Disbracon Dist. de Materiais Elétricos e construção",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Distribuídora material elétrico",
		"status" : "não padrão"
	},
	{
		"id" : "85d02117-b75d-47b8-ad2f-bc965bbe798c",
		"name" : "DPA SEGURANCA ELETRONICA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Alarme",
		"status" : "não padrão"
	},
	{
		"id" : "85d02117-b75d-47b8-ad2f-bc965bbe798c",
		"name" : "DPA SEGURANCA ELETRONICA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Câmeras",
		"status" : "não padrão"
	},
	{
		"id" : "85d02117-b75d-47b8-ad2f-bc965bbe798c",
		"name" : "DPA SEGURANCA ELETRONICA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Cerca elétrica",
		"status" : "não padrão"
	},
	{
		"id" : "85d02117-b75d-47b8-ad2f-bc965bbe798c",
		"name" : "DPA SEGURANCA ELETRONICA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle de acesso",
		"status" : "não padrão"
	},
	{
		"id" : "85d02117-b75d-47b8-ad2f-bc965bbe798c",
		"name" : "DPA SEGURANCA ELETRONICA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle remoto",
		"status" : "não padrão"
	},
	{
		"id" : "85d02117-b75d-47b8-ad2f-bc965bbe798c",
		"name" : "DPA SEGURANCA ELETRONICA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Manutençao de portão eletrônico",
		"status" : "não padrão"
	},
	{
		"id" : "6d8e5326-1808-4a67-8738-fdd6ed31aa5c",
		"name" : "DRJ RADIOCOMUNICACAO LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Vendas",
		"status" : "não padrão"
	},
	{
		"id" : "03ba9bc1-0b01-42ed-bbeb-2e63f9ae3282",
		"name" : "EDIVANDRO PIRES DA SILVA OLIVEIRA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Serviço de limpeza",
		"status" : "não padrão"
	},
	{
		"id" : "e79c8659-cc03-4678-be9f-ed9740a1c11d",
		"name" : "ELEVADORES ATLAS SCHINDLER LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Elevadores",
		"status" : "não padrão"
	},
	{
		"id" : "6b758cdd-1f91-424d-ad18-b77356400c7b",
		"name" : "ELOTECH ELEVADORES",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Elevadores",
		"status" : "não padrão"
	},
	{
		"id" : "98e2a52f-15b8-4683-9d52-5b2c68630a6c",
		"name" : "ENCANADOR/LIMPEZA CX D´AGUA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "98e2a52f-15b8-4683-9d52-5b2c68630a6c",
		"name" : "ENCANADOR/LIMPEZA CX D´AGUA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "cf742b3d-8b1d-4126-8dda-a80f59c64793",
		"name" : "ENCANADOR (RES.VILLARI)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "a3684c47-09e5-4fb8-ac77-e26f5cad8264",
		"name" : "ENGENHEIRA CENTRAL GÁS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Engenharia",
		"status" : "não padrão"
	},
	{
		"id" : "8308749c-fdc9-487b-b97c-0abb1d193bc1",
		"name" : "ESTACIO TERRAPLENAGEM LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Terraplanagem",
		"status" : "não padrão"
	},
	{
		"id" : "36ad2248-06d6-4ee9-8abf-fc973de465d0",
		"name" : "EXTIMBRÁS COM. DE EXTINTORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Extintores",
		"status" : "não padrão"
	},
	{
		"id" : "36ad2248-06d6-4ee9-8abf-fc973de465d0",
		"name" : "EXTIMBRÁS COM. DE EXTINTORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Mangueiras  de incêndio",
		"status" : "não padrão"
	},
	{
		"id" : "98465883-4296-44b5-983f-9e0a5cc90dee",
		"name" : "EXTIMPOMER EXTINTORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Extintores",
		"status" : "não padrão"
	},
	{
		"id" : "98465883-4296-44b5-983f-9e0a5cc90dee",
		"name" : "EXTIMPOMER EXTINTORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Mangueiras  de incêndio",
		"status" : "não padrão"
	},
	{
		"id" : "5362ae6e-55c3-43b8-a820-c882798552ea",
		"name" : "EXTINTORES SC LTDA (EXTINFORT)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Extintores",
		"status" : "não padrão"
	},
	{
		"id" : "5362ae6e-55c3-43b8-a820-c882798552ea",
		"name" : "EXTINTORES SC LTDA (EXTINFORT)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Mangueiras  de incêndio",
		"status" : "não padrão"
	},
	{
		"id" : "42be8387-60cb-4c3a-ae5f-a7af05bf2ed6",
		"name" : "FERNANDO PINTOR",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pintura",
		"status" : "padrão"
	},
	{
		"id" : "9ff733d8-bfb4-42a4-adbd-f6ceb47ff5b4",
		"name" : "FRECH JARDINAGEM E SERVIÇOS GERAIS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "9ff733d8-bfb4-42a4-adbd-f6ceb47ff5b4",
		"name" : "FRECH JARDINAGEM E SERVIÇOS GERAIS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Jardinagem",
		"status" : "não padrão"
	},
	{
		"id" : "9ff733d8-bfb4-42a4-adbd-f6ceb47ff5b4",
		"name" : "FRECH JARDINAGEM E SERVIÇOS GERAIS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Serviço de limpeza",
		"status" : "não padrão"
	},
	{
		"id" : "821d56eb-c7e7-4c69-9ec2-69ad55f6ee9f",
		"name" : "GALBRIL GALVANIZAÇÃO (RES. VILLARI)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "0fb5c736-41b4-4f51-a82f-5994cf764e4c",
		"name" : "GILBERTO MARTINS - PEDREIRO/MANUTENÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pedreiro",
		"status" : "não padrão"
	},
	{
		"id" : "ef5fe15e-fe26-461f-92b6-dc8dfb966621",
		"name" : "Grupo engetel automação e Segurança",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "CFTV/ANTENA/INTERFONE/PORTÃO AUTOMÁTICO",
		"status" : "não padrão"
	},
	{
		"id" : "ef5fe15e-fe26-461f-92b6-dc8dfb966621",
		"name" : "Grupo engetel automação e Segurança",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle de acesso",
		"status" : "não padrão"
	},
	{
		"id" : "ef5fe15e-fe26-461f-92b6-dc8dfb966621",
		"name" : "Grupo engetel automação e Segurança",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle remoto",
		"status" : "não padrão"
	},
	{
		"id" : "ef5fe15e-fe26-461f-92b6-dc8dfb966621",
		"name" : "Grupo engetel automação e Segurança",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Monitoramento",
		"status" : "não padrão"
	},
	{
		"id" : "d66d9c1b-96ed-4736-a2f5-6217e4646bbe",
		"name" : "HIDRAGÁS LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Man. e projetos de combate a incendio",
		"status" : "não padrão"
	},
	{
		"id" : "b53905b8-8a3a-4c82-84ed-00ac167b9ddd",
		"name" : " Imunizadora Jaragua Ltda ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "b53905b8-8a3a-4c82-84ed-00ac167b9ddd",
		"name" : " Imunizadora Jaragua Ltda ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "b53905b8-8a3a-4c82-84ed-00ac167b9ddd",
		"name" : " Imunizadora Jaragua Ltda ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "b53905b8-8a3a-4c82-84ed-00ac167b9ddd",
		"name" : " Imunizadora Jaragua Ltda ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "b53905b8-8a3a-4c82-84ed-00ac167b9ddd",
		"name" : " Imunizadora Jaragua Ltda ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "b53905b8-8a3a-4c82-84ed-00ac167b9ddd",
		"name" : " Imunizadora Jaragua Ltda ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza cisterna",
		"status" : "não padrão"
	},
	{
		"id" : "4339246d-09ca-434f-a800-8a7ce41372f8",
		"name" : "Insetblu Limpezas e controle de pragas",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "4339246d-09ca-434f-a800-8a7ce41372f8",
		"name" : "Insetblu Limpezas e controle de pragas",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "4339246d-09ca-434f-a800-8a7ce41372f8",
		"name" : "Insetblu Limpezas e controle de pragas",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "4339246d-09ca-434f-a800-8a7ce41372f8",
		"name" : "Insetblu Limpezas e controle de pragas",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "4339246d-09ca-434f-a800-8a7ce41372f8",
		"name" : "Insetblu Limpezas e controle de pragas",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "4339246d-09ca-434f-a800-8a7ce41372f8",
		"name" : "Insetblu Limpezas e controle de pragas",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "c19c91a4-3b24-4cc2-bd6c-84994e185093",
		"name" : "INSTALCENTER",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Man. e projetos de combate a incendio",
		"status" : "não padrão"
	},
	{
		"id" : "48754f40-55f3-4fd1-935b-848fd5e775d1",
		"name" : "JAIR (ESPECIALISTA EM TELHAS SHINGLE/VILLARI ) ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pedreiro",
		"status" : "não padrão"
	},
	{
		"id" : "c2313fa0-8d5f-418f-a752-8a4250c7d62d",
		"name" : "JS ADMINISTRADORA DE CONDOMINIOS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "19d88992-eb67-40f6-a80d-81f50a5c2d20",
		"name" : "Juceli Oliveira Gomes ",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "eb164d43-90a2-42ad-b9b2-28c343509779",
		"name" : "JZJ SERVIÇOS E MANUTENÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "eb164d43-90a2-42ad-b9b2-28c343509779",
		"name" : "JZJ SERVIÇOS E MANUTENÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "ENCANADOR",
		"status" : "não padrão"
	},
	{
		"id" : "eb164d43-90a2-42ad-b9b2-28c343509779",
		"name" : "JZJ SERVIÇOS E MANUTENÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pedreiro",
		"status" : "não padrão"
	},
	{
		"id" : "eb164d43-90a2-42ad-b9b2-28c343509779",
		"name" : "JZJ SERVIÇOS E MANUTENÇÃO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pintura",
		"status" : "padrão"
	},
	{
		"id" : "0f96d3b7-5b2e-4ca2-970c-698e179a2746",
		"name" : "KANNENBERG & CIA LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Varejo",
		"status" : "não padrão"
	},
	{
		"id" : "3b6cf7bf-cda0-43be-b132-fb53f0881f99",
		"name" : "KI PISCINAS E ACESSORIOS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Manutenção em piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "3b6cf7bf-cda0-43be-b132-fb53f0881f99",
		"name" : "KI PISCINAS E ACESSORIOS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Produtos piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "e3bea689-1ccf-4483-b4f4-b1e071b76202",
		"name" : "KONEKI ELEVADORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Elevadores",
		"status" : "não padrão"
	},
	{
		"id" : "3f4287d2-d9c2-4d4b-b1d1-2da526f6e561",
		"name" : "LG SERVIÇOS TERCEIRIZADOS LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Serviço de limpeza",
		"status" : "não padrão"
	},
	{
		"id" : "3f4287d2-d9c2-4d4b-b1d1-2da526f6e561",
		"name" : "LG SERVIÇOS TERCEIRIZADOS LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Serviço de zeladoria",
		"status" : "não padrão"
	},
	{
		"id" : "830c7898-99d0-4636-a744-6e78b75e5cb8",
		"name" : "LIQUIGÁS - TELE ENTREGA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Distribuídora de gás",
		"status" : "não padrão"
	},
	{
		"id" : "dde92672-b75d-48e5-a24d-57373e5509ee",
		"name" : "LUCIAN FILIPE",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "2f09395e-5bca-4652-9db5-75a0dff7252f",
		"name" : "Marcenaria Garcia (Villari)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Marcenaria",
		"status" : "não padrão"
	},
	{
		"id" : "b8d3d534-6ba7-42d5-a506-1682e6bca798",
		"name" : "Marwilt | Filtros Centrais e Projetos de Tratamento de Água",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Tratamento de água",
		"status" : "não padrão"
	},
	{
		"id" : "297626ac-e75e-4185-a2d9-dd95e4192bb0",
		"name" : "MAYER COLETA RESIDUO NAO PERIGOSOS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Coleta de entulhos",
		"status" : "não padrão"
	},
	{
		"id" : "6daa0785-e155-4b12-9935-9dd1ddeb081a",
		"name" : "MJM DEDETIZAÇÃO SERVIÇOS LTDA (INSECTBLU)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "6daa0785-e155-4b12-9935-9dd1ddeb081a",
		"name" : "MJM DEDETIZAÇÃO SERVIÇOS LTDA (INSECTBLU)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "6daa0785-e155-4b12-9935-9dd1ddeb081a",
		"name" : "MJM DEDETIZAÇÃO SERVIÇOS LTDA (INSECTBLU)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "6daa0785-e155-4b12-9935-9dd1ddeb081a",
		"name" : "MJM DEDETIZAÇÃO SERVIÇOS LTDA (INSECTBLU)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "a88d58dc-df9a-4e75-a804-ebec8490aef9",
		"name" : "OBJETIVA ADMINISTRADORA DE CONDOMINIOS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "6c7797a2-95f3-46eb-a4a6-53294d982e79",
		"name" : " Osni ( Indicação Maski)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Instalador de pavers",
		"status" : "não padrão"
	},
	{
		"id" : "6c7797a2-95f3-46eb-a4a6-53294d982e79",
		"name" : " Osni ( Indicação Maski)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Pedreiro",
		"status" : "não padrão"
	},
	{
		"id" : "9b36877a-549b-4203-8c30-f34c7b778233",
		"name" : "POSTO JENSEN LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Combustivel",
		"status" : "não padrão"
	},
	{
		"id" : "82155632-8ffb-4a14-80c2-8ca9cfcf4713",
		"name" : "PREVENÇÃO EXTINTORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Extintores",
		"status" : "não padrão"
	},
	{
		"id" : "82155632-8ffb-4a14-80c2-8ca9cfcf4713",
		"name" : "PREVENÇÃO EXTINTORES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Mangueiras  de incêndio",
		"status" : "não padrão"
	},
	{
		"id" : "74b6646a-8bde-4ce5-9b7c-9794f3b2f6e1",
		"name" : "QUALITY SISTEMAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Câmeras",
		"status" : "não padrão"
	},
	{
		"id" : "74b6646a-8bde-4ce5-9b7c-9794f3b2f6e1",
		"name" : "QUALITY SISTEMAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Cerca elétrica",
		"status" : "não padrão"
	},
	{
		"id" : "74b6646a-8bde-4ce5-9b7c-9794f3b2f6e1",
		"name" : "QUALITY SISTEMAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle de acesso",
		"status" : "não padrão"
	},
	{
		"id" : "74b6646a-8bde-4ce5-9b7c-9794f3b2f6e1",
		"name" : "QUALITY SISTEMAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle remoto",
		"status" : "não padrão"
	},
	{
		"id" : "74b6646a-8bde-4ce5-9b7c-9794f3b2f6e1",
		"name" : "QUALITY SISTEMAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "74b6646a-8bde-4ce5-9b7c-9794f3b2f6e1",
		"name" : "QUALITY SISTEMAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Manutençao de portão eletrônico",
		"status" : "não padrão"
	},
	{
		"id" : "42529964-423e-4c90-8218-de47c5da29af",
		"name" : "RC SISTEMAS DE SEGURANÇA ELETRONICA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Câmeras",
		"status" : "não padrão"
	},
	{
		"id" : "42529964-423e-4c90-8218-de47c5da29af",
		"name" : "RC SISTEMAS DE SEGURANÇA ELETRONICA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle de acesso",
		"status" : "não padrão"
	},
	{
		"id" : "42529964-423e-4c90-8218-de47c5da29af",
		"name" : "RC SISTEMAS DE SEGURANÇA ELETRONICA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Controle remoto",
		"status" : "não padrão"
	},
	{
		"id" : "42529964-423e-4c90-8218-de47c5da29af",
		"name" : "RC SISTEMAS DE SEGURANÇA ELETRONICA LTDA ME",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Manutençao de portão eletrônico",
		"status" : "não padrão"
	},
	{
		"id" : "95cd75fb-efab-44a7-8a97-e18522cdca00",
		"name" : "R E Desentupidora E Limpa Fossa 24 horas (Acquatec desentuidora)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "95cd75fb-efab-44a7-8a97-e18522cdca00",
		"name" : "R E Desentupidora E Limpa Fossa 24 horas (Acquatec desentuidora)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "95cd75fb-efab-44a7-8a97-e18522cdca00",
		"name" : "R E Desentupidora E Limpa Fossa 24 horas (Acquatec desentuidora)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "2b4f9028-ab5e-47c8-aa5e-e388cd428364",
		"name" : "RS ADMINISTRADORA DE CONDOMINIOS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Administradora",
		"status" : "não padrão"
	},
	{
		"id" : "7ca17da5-d235-4daa-becc-ac97ed92794e",
		"name" : "SAMAE TRATAMENTO DE ÁGUA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Tratamento de água",
		"status" : "não padrão"
	},
	{
		"id" : "84f927a7-4047-4ddd-934b-2ce0d46a95c4",
		"name" : "SC-LAUDOS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Engenharia",
		"status" : "não padrão"
	},
	{
		"id" : "8ae0ed31-8eef-49e0-80b9-c7cf64271d89",
		"name" : "SERRALHERIA DO CONDOMINIO",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Janelas e esquadrias",
		"status" : "não padrão"
	},
	{
		"id" : "52c70b36-270c-4b25-a907-c0d4064c2662",
		"name" : "SIDRIOLI RECICLADOS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Coleta de reciclados",
		"status" : "não padrão"
	},
	{
		"id" : "94ed0f3a-7a06-4605-a15b-34ce9a2ab392",
		"name" : "SI-IMPERMEABILIZAÇÔES MANTA ASFALTICA - FLEXIVEL",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "eecd8e61-40f8-4b88-848e-abc4c1263c46",
		"name" : "SILVIO ENGENHEIRO (VILLARI)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Engenharia",
		"status" : "não padrão"
	},
	{
		"id" : "f9036c73-6317-455d-83fe-e3d1b549c375",
		"name" : "STANDARD COMERCIO SERVIÇOS ELETRONICOS LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "BOMBAS HIDRAULICAS",
		"status" : "não padrão"
	},
	{
		"id" : "73143439-3921-4418-a41e-8e2e74d58ffe",
		"name" : "TAYU QUIMICA LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Produtos de limpeza",
		"status" : "não padrão"
	},
	{
		"id" : "bd23f7dc-3d08-4b85-a9b9-84aa9622a16a",
		"name" : "TENDÊNCIA SEGURANÇA E VIGILÂNCIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Portaria",
		"status" : "não padrão"
	},
	{
		"id" : "bd23f7dc-3d08-4b85-a9b9-84aa9622a16a",
		"name" : "TENDÊNCIA SEGURANÇA E VIGILÂNCIA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Vigilância",
		"status" : "não padrão"
	},
	{
		"id" : "54dd82f4-cbb9-43cb-bc18-4787fa5eb978",
		"name" : "TOMAS ELETRICISTA (BOMBAS VILLARI)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "BOMBAS HIDRAULICAS",
		"status" : "não padrão"
	},
	{
		"id" : "54dd82f4-cbb9-43cb-bc18-4787fa5eb978",
		"name" : "TOMAS ELETRICISTA (BOMBAS VILLARI)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "60df8f56-f06b-4eae-93e1-6796a47d579f",
		"name" : "TROKE REFORMAS E CONSTRUÇOES LTDA",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "EMPREITEIRAS",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Dedetização",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desentupidora",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Desratização",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa D'água",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza caixa gordura",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza cisterna",
		"status" : "não padrão"
	},
	{
		"id" : "50223ec7-7d3b-4082-b717-f8fb4643ec01",
		"name" : "VETOR CONTROLE DE PRAGAS",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Limpeza fossa",
		"status" : "não padrão"
	},
	{
		"id" : "5a687650-f836-424a-be72-7e8039422b4c",
		"name" : "WS SERRALHERIA  (PORTÃO/CORRIMÃO)",
		"companyId" : "96e55e2d-2769-4b2c-b177-a52746d27f73",
		"label" : "Portões",
		"status" : "não padrão"
	},
	{
		"id" : "b352e600-8451-4612-b418-2f10fff9f2aa",
		"name" : "Aplha Clean",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "b352e600-8451-4612-b418-2f10fff9f2aa",
		"name" : "Aplha Clean",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Outros",
		"status" : "padrão"
	},
	{
		"id" : "9136c155-c4cc-43ec-80a7-1ed477e8b127",
		"name" : "Extintores Criciuma",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Gás",
		"status" : "padrão"
	},
	{
		"id" : "9136c155-c4cc-43ec-80a7-1ed477e8b127",
		"name" : "Extintores Criciuma",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Outros",
		"status" : "padrão"
	},
	{
		"id" : "ed48fde3-6e11-404a-8bbc-b700cb4baf2c",
		"name" : "Inova Portas e Ferragens",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Portas e janelas",
		"status" : "padrão"
	},
	{
		"id" : "473551a7-935b-4f65-bd0e-73cf5af5501c",
		"name" : "L & P Portões e Motores",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Mecânica",
		"status" : "padrão"
	},
	{
		"id" : "f43db6f7-740e-4cf2-b965-f4a38a5fa6b8",
		"name" : "Parana Encanador",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "7cfa87a2-6e23-4308-8e13-787387ca68a0",
		"name" : "Seu Zé Pedreiro",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Acabamentos",
		"status" : "padrão"
	},
	{
		"id" : "7cfa87a2-6e23-4308-8e13-787387ca68a0",
		"name" : "Seu Zé Pedreiro",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Gás",
		"status" : "padrão"
	},
	{
		"id" : "7cfa87a2-6e23-4308-8e13-787387ca68a0",
		"name" : "Seu Zé Pedreiro",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "7cfa87a2-6e23-4308-8e13-787387ca68a0",
		"name" : "Seu Zé Pedreiro",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Outros",
		"status" : "padrão"
	},
	{
		"id" : "7cfa87a2-6e23-4308-8e13-787387ca68a0",
		"name" : "Seu Zé Pedreiro",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Pintura",
		"status" : "padrão"
	},
	{
		"id" : "7cfa87a2-6e23-4308-8e13-787387ca68a0",
		"name" : "Seu Zé Pedreiro",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Portas e janelas",
		"status" : "padrão"
	},
	{
		"id" : "77b4db34-4a6b-4549-a293-5a38e5c4828e",
		"name" : "Souza Eletricista",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "49f5b52b-1789-418f-84b2-a053226fa813",
		"name" : "Trombim Detetização",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "49f5b52b-1789-418f-84b2-a053226fa813",
		"name" : "Trombim Detetização",
		"companyId" : "ac6adf37-4bfb-4c16-8656-62db0547efca",
		"label" : "Outros",
		"status" : "padrão"
	},
	{
		"id" : "7ccb7632-6314-4ed9-97c8-7e0ff9cb3132",
		"name" : "ALAN FERNANDES",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Eletricista",
		"status" : "não padrão"
	},
	{
		"id" : "7ccb7632-6314-4ed9-97c8-7e0ff9cb3132",
		"name" : "ALAN FERNANDES",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Portões",
		"status" : "não padrão"
	},
	{
		"id" : "6a35765d-4955-43fa-88f0-94b331506fe7",
		"name" : "CAPACHOS COMERCIO DE TAPETES LTDA ME",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Tapetes e capachos",
		"status" : "não padrão"
	},
	{
		"id" : "88598104-0d35-4631-8fab-bea650fd8dfd",
		"name" : "Claudemir Rosa Garcia",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Manutenção em piscinas",
		"status" : "não padrão"
	},
	{
		"id" : "de477390-a440-48ad-bc0d-2ecf83be32ea",
		"name" : "CLOCK CORES - FRANCINI CLOCK SPROTTE",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Pintura",
		"status" : "padrão"
	},
	{
		"id" : "de477390-a440-48ad-bc0d-2ecf83be32ea",
		"name" : "CLOCK CORES - FRANCINI CLOCK SPROTTE",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Vendas",
		"status" : "não padrão"
	},
	{
		"id" : "fe331cbe-3b0b-4c70-b248-dd20a0ae3529",
		"name" : "COMERCIAL CLOCK",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Material de construção",
		"status" : "não padrão"
	},
	{
		"id" : "b91e06a8-49da-4895-bf9d-db2b75ad915f",
		"name" : "COND MERCADOCOND EQUIPAMENTOS PARA CONDOMINIOS",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Carrinhos",
		"status" : "não padrão"
	},
	{
		"id" : "b91e06a8-49da-4895-bf9d-db2b75ad915f",
		"name" : "COND MERCADOCOND EQUIPAMENTOS PARA CONDOMINIOS",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Cartões",
		"status" : "não padrão"
	},
	{
		"id" : "b91e06a8-49da-4895-bf9d-db2b75ad915f",
		"name" : "COND MERCADOCOND EQUIPAMENTOS PARA CONDOMINIOS",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Materiais para condominio",
		"status" : "não padrão"
	},
	{
		"id" : "065c1a34-a174-4856-ba7e-6236e1b48c2a",
		"name" : "Fabio Chaveiro - Fabio Antonio Andrieti",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Chaveiro",
		"status" : "não padrão"
	},
	{
		"id" : "c6f488f4-8d77-44e3-a2f1-1ef3cd5d29ad",
		"name" : "GODIN - Gilmara da Rosa de Godin",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Controle de acesso",
		"status" : "não padrão"
	},
	{
		"id" : "c6f488f4-8d77-44e3-a2f1-1ef3cd5d29ad",
		"name" : "GODIN - Gilmara da Rosa de Godin",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "c6f488f4-8d77-44e3-a2f1-1ef3cd5d29ad",
		"name" : "GODIN - Gilmara da Rosa de Godin",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Portões",
		"status" : "não padrão"
	},
	{
		"id" : "f64bc7a2-73be-4ac6-abd5-d9c4307fa2a1",
		"name" : "MANU INDUSTRIA E COMERCIO DE CAIXAS DE  CORREIOS LTDA",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Caixas para correio",
		"status" : "não padrão"
	},
	{
		"id" : "c44eda13-27a6-4090-9085-b96768c5e7a2",
		"name" : "PREMIER ELÉTRICA E ILUMINAÇÃO EIRELI",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Elétrica",
		"status" : "padrão"
	},
	{
		"id" : "c44eda13-27a6-4090-9085-b96768c5e7a2",
		"name" : "PREMIER ELÉTRICA E ILUMINAÇÃO EIRELI",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Materiais",
		"status" : "não padrão"
	},
	{
		"id" : "90cf0d6e-5555-41a9-9670-fb5b75edc938",
		"name" : "Via D'Água",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Hidráulica",
		"status" : "padrão"
	},
	{
		"id" : "90cf0d6e-5555-41a9-9670-fb5b75edc938",
		"name" : "Via D'Água",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Venda de produtos",
		"status" : "não padrão"
	},
	{
		"id" : "ba161468-09cb-4e7b-952c-b24ff5e6c6a7",
		"name" : "VIDROS ARNS LTDA",
		"companyId" : "af0d0b58-137c-48de-ac4c-8a1b5d833834",
		"label" : "Vidracaria",
		"status" : "não padrão"
	},
	{
		"id" : "863be7ef-09f4-41cc-a7b9-8db7ae64ffab",
		"name" : "Floricultura Porto Verde",
		"companyId" : "c7bd18d9-59c8-4878-afa0-fc6cd4dd6c17",
		"label" : "Outros",
		"status" : "padrão"
	},
	{
		"id" : "c6623ea4-e1f6-4ebb-a2ae-ed45c70d0bfa",
		"name" : "DIOGO VIDROS DS GLASS",
		"companyId" : "d8728f49-ec82-48c5-a694-398a7c22fd43",
		"label" : "Janelas e esquadrias",
		"status" : "não padrão"
	},
	{
		"id" : "c6623ea4-e1f6-4ebb-a2ae-ed45c70d0bfa",
		"name" : "DIOGO VIDROS DS GLASS",
		"companyId" : "d8728f49-ec82-48c5-a694-398a7c22fd43",
		"label" : "Vidracaria",
		"status" : "não padrão"
	},
	{
		"id" : "c6623ea4-e1f6-4ebb-a2ae-ed45c70d0bfa",
		"name" : "DIOGO VIDROS DS GLASS",
		"companyId" : "d8728f49-ec82-48c5-a694-398a7c22fd43",
		"label" : "Vidros",
		"status" : "não padrão"
	},
	{
		"id" : "ffc71ead-4e28-48c4-8558-69e5810ccd19",
		"name" : "Aquabrasilis ",
		"companyId" : "e92479d6-bcb5-4851-9708-aae864f8fdf3",
		"label" : "Outros",
		"status" : "padrão"
	}
]
`;

  const parsed: {
    id: string;
    name: string;
    companyId: string;
    label: string;
    status: 'padrão' | 'não padrão';
  }[] = JSON.parse(json);

  const areas = await prisma.areaOfActivity.findMany();

  for (let i = 0; i < parsed.length; i++) {
    const element = parsed[i];
    // eslint-disable-next-line no-console
    console.log(`RODANDO ${i + 1} de ${parsed.length}`);

    if (element.status === 'padrão') {
      const existingArea = areas.find(({ label }) => label === element.label);
      const foundSupplier = await prisma.supplier.findUnique({ where: { id: element.id } });

      if (!existingArea || !foundSupplier) continue;

      await prisma.supplierAreaOfActivity.create({
        data: { supplierId: element.id, areaOfActivityId: existingArea.id },
      });
    } else {
      const foundSupplier = await prisma.supplier.findUnique({ where: { id: element.id } });
      if (!foundSupplier) continue;

      await prisma.supplier.update({
        data: {
          areaOfActivities: {
            create: {
              areaOfActivity: {
                connectOrCreate: {
                  create: { label: element.label, companyId: element.companyId },
                  where: {
                    label_companyId: { companyId: element.companyId, label: element.label },
                  },
                },
              },
            },
          },
        },
        where: { id: element.id },
      });
    }
  }

  return res.status(200).json('OK');
}
