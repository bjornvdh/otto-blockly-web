/*
* Copyright 2018 ARDUINO SA (http://www.arduino.cc/)
* This file is part of arduino-create-agent-js-client.
* Copyright (c) 2018
* Authors: Alberto Iannaccone, Stefania Mellai, Gabriele Destefanis
*
* This software is released under:
* The GNU General Public License, which covers the main part of
* arduino-create-agent-js-client
* The terms of this license can be found at:
* https://www.gnu.org/licenses/gpl-3.0.en.html
*
* You can be released from the requirements of the above licenses by purchasing
* a commercial license. Buying such a license is mandatory if you want to modify or
* otherwise use the software for commercial activities involving the Arduino
* software without disclosing the source code of your own applications. To purchase
* a commercial license, send an email to license@arduino.cc.
*
*/

import React from 'react';
import Daemon from '../src';
import FirmwareUpdater from '../src/firmware-updater';

let uploadClass;

//const compiler_url = "https://arduino-compiler-91-wclxn5z32q-uc.a.run.app/compile";
//const compiler_url = "https://localhost:8080/compile";
//const compiler_url = "https://ottoschool.com:8080/compile";
const compiler_url = "https://proxy.cidesi.mx:3000/compile";

const chromeExtensionID = 'hfejhkbipnickajaidoppbadcomekkde';
const m_stat = {
    COMPILE_DONE: "Done",
    COMPILE_NOPE: "Ready",
    COMPILE_IN_PROGRESS: "Compiling...",
    COMPILE_ERROR: "Error Compiling",
    UPLOAD_DONE: "Done",
    UPLOAD_NOPE: "Ready",
    UPLOAD_IN_PROGRESS: "Uploading...",
    UPLOAD_ERROR: "Error Uploading",
}

const scrollToBottom = (target) => {
    if (target) {
        target.scrollTop = target.scrollHeight; // eslint-disable-line no-param-reassign
    }
};

//const daemon = new Daemon('https://cors-anywhere-wclxn5z32q-uc.a.run.app/https://builder.arduino.cc/v3/boards', chromeExtensionID);
const daemon = new Daemon('https://proxy.cidesi.mx:5000/https://builder.arduino.cc/v3/boards', chromeExtensionID);
//const daemon = new Daemon('https://builder.arduino.cc/v3/boards', chromeExtensionID);
// 'OjEwMDAwMDAwMEM5NDVFMDAwQzk0ODYwMDBDOTQ4NjAwMEM5NEQ1MDQyRA0KOjEwMDAxMDAwMEM5NEQ1MDQwQzk0RDUwNDBDOTQ4NjAwMEM5NEIzMDM3Mg0KOjEwMDAyMDAwMEM5NDg2MDAwQzk0ODYwMDBDOTQ4NjAwMEM5NERGMDREQg0KOjEwMDAzMDAwMEM5NDg2MDAwQzk0ODYwMDBDOTQ4NjAwMEM5NDg2MDAyOA0KOjEwMDA0MDAwMEM5NDhCMDQwQzk0ODYwMDBDOTQ1OTA0MEM5NDMzMDQ4Nw0KOjEwMDA1MDAwMEM5NDg2MDAwQzk0ODYwMDBDOTQ4NjAwMEM5NDg2MDAwOA0KOjEwMDA2MDAwMEM5NDg2MDAwQzk0ODYwMDAwMDAwMDA4MDAwMjAxMDAzOQ0KOjEwMDA3MDAwMDAwMzA0MDcwMDAwMDAwMDAwMDAwMDAwMDIwMDAwMDA3MA0KOjEwMDA4MDAwMDAyNTAwMjgwMDJCMDAwMDAwMDAwMDI0MDAyNzAwMkE4Mw0KOjEwMDA5MDAwMDAwNDA0MDQwNDA0MDQwNDA0MDIwMjAyMDIwMjAyMDMzMQ0KOjEwMDBBMDAwMDMwMzAzMDMwMzAxMDIwNDA4MTAyMDQwODAwMTAyMDQzQg0KOjEwMDBCMDAwMDgxMDIwMDEwMjA0MDgxMDIwMDA5QjA1MTEyNDFGQkUxNw0KOjEwMDBDMDAwQ0ZFRkQ4RTBERUJGQ0RCRjExRTBBMEUwQjFFMEU4RUVCOQ0KOjEwMDBEMDAwRjNFMTAyQzAwNTkwMEQ5MkFDMzFCMTA3RDlGNzIzRTBFRQ0KOjEwMDBFMDAwQUNFMUIxRTAwMUMwMUQ5MkFGMzNCMjA3RTFGNzEwRTAxRg0KOjEwMDBGMDAwQ0VFNUQwRTAwNEMwMjE5N0ZFMDEwRTk0RUMwOUNEMzU4OQ0KOjEwMDEwMDAwRDEwN0M5RjcwRTk0MDMwNjBDOTRGMjA5MEM5NDAwMDA3MQ0KOjEwMDExMDAwOTBFMEZDMDFFQjU1RkY0RjI0OTE4RjU2OUY0RkZDMDE1Rg0KOjEwMDEyMDAwODQ5MTg4MjM5OUYwOTBFMDg4MEY5OTFGRkMwMUU5NTc4QQ0KOjEwMDEzMDAwRkY0RkE1OTFCNDkxRkMwMUUzNThGRjRGODU5MTk0OTEzNQ0KOjEwMDE0MDAwOEZCN0Y4OTRFQzkxRTIyQkVDOTM4RkJGMDg5NUFGOTJBOA0KOjEwMDE1MDAwQkY5MkNGOTJERjkyRUY5MkZGOTIwRjkzMUY5M0NGOTNCNA0KOjEwMDE2MDAwREY5MzZDMDE3QjAxOEIwMTA0MEYxNTFGRUIwMTVFMDExNg0KOjEwMDE3MDAwQUUxOEJGMDhDMDE3RDEwNzU5RjA2OTkxRDYwMUVEOTFBQg0KOjEwMDE4MDAwRkM5MTAxOTBGMDgxRTAyREM2MDEwOTk1ODkyQjc5Rjc0QQ0KOjEwMDE5MDAwQzUwMURGOTFDRjkxMUY5MTBGOTFGRjkwRUY5MERGOTBGQw0KOjEwMDFBMDAwQ0Y5MEJGOTBBRjkwMDg5NUZDMDE1MzhENDQ4RDI1MkZDMw0KOjEwMDFCMDAwMzBFMDg0MkY5MEUwODIxQjkzMEI1NDE3MTBGMENGOTYwMQ0KOjEwMDFDMDAwMDg5NTAxOTcwODk1RkMwMTkxOEQ4MjhEOTgxNzYxRjAzMw0KOjEwMDFEMDAwQTI4REFFMEZCRjJGQjExRDVEOTY4QzkxOTI4RDlGNUY0QQ0KOjEwMDFFMDAwOUY3MzkyOEY5MEUwMDg5NThGRUY5RkVGMDg5NUZDMDEyOQ0KOjEwMDFGMDAwOTE4RDgyOEQ5ODE3MzFGMDgyOERFODBGRjExRDg1OEREQw0KOjEwMDIwMDAwOTBFMDA4OTU4RkVGOUZFRjA4OTVGQzAxOTE4RDIyOEQ2RQ0KOjEwMDIxMDAwODkyRjkwRTA4MDVDOUY0RjgyMUI5MTA5OEY3Mzk5MjdGMw0KOjEwMDIyMDAwMDg5NTg3RTM5MUUwMEU5NDA1MDEyMUUwODkyQjA5RjRGQw0KOjEwMDIzMDAwMjBFMDgyMkYwODk1ODBFMDkwRTA4OTJCMjlGMDBFOTQzMQ0KOjEwMDI0MDAwMTEwMTgxMTEwQzk0MDAwMDA4OTVGQzAxQTQ4REE4MEZFOA0KOjEwMDI1MDAwQjkyRkIxMURBMzVBQkY0RjJDOTE4NDhEOTBFMDAxOTYwOA0KOjEwMDI2MDAwOEY3Mzk5Mjc4NDhGQTY4OUI3ODkyQzkzQTA4OUIxODkyOA0KOjEwMDI3MDAwOEM5MTgzNzA4MDY0OEM5MzkzOEQ4NDhEOTgxMzA2QzBDOQ0KOjEwMDI4MDAwMDI4OEYzODlFMDJEODA4MThGN0Q4MDgzMDg5NUVGOTIyRA0KOjEwMDI5MDAwRkY5MjBGOTMxRjkzQ0Y5M0RGOTNFQzAxODFFMDg4OEY0MA0KOjEwMDJBMDAwOUI4RDhDOEQ5ODEzMUFDMEU4ODlGOTg5ODA4MTg1RkYxMA0KOjEwMDJCMDAwMTVDMDlGQjdGODk0RUU4OUZGODk2MDgzRTg4OUY5ODlCMg0KOjEwMDJDMDAwODA4MTgzNzA4MDY0ODA4MzlGQkY4MUUwOTBFMERGOTFCNA0KOjEwMDJEMDAwQ0Y5MTFGOTEwRjkxRkY5MEVGOTAwODk1RjYyRTBCOEQwNw0KOjEwMDJFMDAwMTBFMDBGNUYxRjRGMEY3MzExMjdFMDJFOEM4RDhFMTFDMg0KOjEwMDJGMDAwMENDMDBGQjYwN0ZDRkFDRkU4ODlGOTg5ODA4MTg1RkYyOQ0KOjEwMDMwMDAwRjVDRkNFMDEwRTk0MjUwMUYxQ0ZFQjhERUMwRkZEMkYzMw0KOjEwMDMxMDAwRjExREUzNUFGRjRGRjA4MjlGQjdGODk0MEI4RkVBODlFMw0KOjEwMDMyMDAwRkI4OTgwODE4MDYyQ0ZDRkNGOTNERjkzRUMwMTg4OERGMg0KOjEwMDMzMDAwODgyM0I5RjBBQTg5QkI4OUU4ODlGOTg5OEM5MTg1RkQ2MA0KOjEwMDM0MDAwMDNDMDgwODE4NkZEMERDMDBGQjYwN0ZDRjdDRjhDOTFFRQ0KOjEwMDM1MDAwODVGRkYyQ0Y4MDgxODVGRkVEQ0ZDRTAxMEU5NDI1MDE4MA0KOjEwMDM2MDAwRTlDRkRGOTFDRjkxMDg5NTkwRTBGQzAxRTg1OUZGNEY2Qw0KOjEwMDM3MDAwMjQ5MUZDMDFFQjU1RkY0RjM0OTFGQzAxRUY1NkZGNEZFOA0KOjEwMDM4MDAwRTQ5MUVFMjNDOUYwMjIyMzM5RjAyMzMwMDFGMUE4RjRERg0KOjEwMDM5MDAwMjEzMDE5RjEyMjMwMjlGMUYwRTBFRTBGRkYxRkUzNTg3MA0KOjEwMDNBMDAwRkY0RkE1OTFCNDkxOEZCN0Y4OTRFQzkxNjExMTI2QzBERA0KOjEwMDNCMDAwMzA5NTNFMjMzQzkzOEZCRjA4OTUyNzMwQTlGMDI4MzAxNQ0KOjEwMDNDMDAwQzlGMDI0MzA0OUY3ODA5MTgwMDA4RjdEMDNDMDgwOTE2Rg0KOjEwMDNEMDAwODAwMDhGNzc4MDkzODAwMERGQ0Y4NEI1OEY3Nzg0QkRENg0KOjEwMDNFMDAwREJDRjg0QjU4RjdERkJDRjgwOTFCMDAwOEY3NzgwOTM3QQ0KOjEwMDNGMDAwQjAwMEQyQ0Y4MDkxQjAwMDhGN0RGOUNGM0UyQkRBQ0YwNQ0KOjEwMDQwMDAwMkZCN0Y4OTQ2MDkxMkUwMTcwOTEyRjAxODA5MTMwMDFFNw0KOjEwMDQxMDAwOTA5MTMxMDEyRkJGMDg5NUNGOTJERjkyRUY5MkZGOTIxQQ0KOjEwMDQyMDAwQ0Y5M0RGOTNFQzAxNjAzMjgyRTA3ODA3Q0NGNTY1M0IzNw0KOjEwMDQzMDAwNzEwNTE0RjA2NEVCNzBFMDg5ODEyOEU4MzBFMDI4MUIzNg0KOjEwMDQ0MDAwMzEwOTg3RkQzMzk1MjIwRjMzMUYyMjBGMzMxRjY5MDFCNg0KOjEwMDQ1MDAwMzMwRkVFMDhGRjA4OEE4MTI4RTUzMkUwMjgxQjMxMDlCNg0KOjEwMDQ2MDAwODdGRDMzOTUyMjBGMzMxRjIyMEYzMzFGMDMyRTAwMENGRA0KOjEwMDQ3MDAwNDQwQjU1MEIyQzE5M0QwOTRFMDk1RjA5REIwMTc3RkYzMQ0KOjEwMDQ4MDAwMDJDMEIwRTBBMEUwMEU5NERDMDcyNEVCMzBFMDQwRTBENg0KOjEwMDQ5MDAwNTBFMDBFOTRCMjA3QzIwRUQzMUVFNDFFRjUxRUI2MDE0NA0KOjEwMDRBMDAwRTg4MUVDMzA3MEY1Mjk4MTg4RTg5MEUwODIxQjkxMDlBMQ0KOjEwMDRCMDAwMjdGRDkzOTU4ODBGOTkxRjg4MEY5OTFGNjgxNzc5MDc1Mw0KOjEwMDRDMDAwN0NGMDJBODE4OEU1OTJFMDgyMUI5MTA5MjdGRDkzOTVCMw0KOjEwMDREMDAwODgwRjk5MUY4ODBGOTkxRjY4MTc3OTA3MENGNENCMDFCMw0KOjEwMDRFMDAwMDI5Nzg4MEY5OTFGNEZCN0Y4OTQyRTJGMzBFMEY5MDEyQg0KOjEwMDRGMDAwRUUwRkZGMUZFMjBGRjMxRkVDNTJGRTRGOTI4MzgxODMzQQ0KOjEwMDUwMDAwNEZCRkRGOTFDRjkxRkY5MEVGOTBERjkwQ0Y5MDA4OTU5NA0KOjEwMDUxMDAwMUY5M0NGOTNERjkzRUMwMTk4ODEyOTJGMzBFMEY5MDFFRA0KOjEwMDUyMDAwRUUwRkZGMUZFMjBGRjMxRkVDNTJGRTRGODA4MTg2RkQ5RQ0KOjEwMDUzMDAwOENDMDE2MkY5QzMwMDhGMDREQzA4NjJGMEU5NDg4MDA3QQ0KOjEwMDU0MDAwODg4MTI4MkYzMEUwRjkwMUVFMEZGRjFGRTIwRkYzMUYyMw0KOjEwMDU1MDAwRUM1MkZFNEYxRjczNjA4MTYwN0MxNjJCMTA4MzE5ODI1Mg0KOjEwMDU2MDAwMUE4MjJDRTA2MjJGMEU5NEI4MDk4MjlGQjAwMTExMjRFOA0KOjEwMDU3MDAwMzBFMDIwRTBBQjAxNDIwRjUzMUZGQTAxRUUwRkZGMUZFNg0KOjEwMDU4MDAwRTQwRkY1MUZFQzUyRkU0RjkwODE5NkZEMTZDMDJGNUZEMQ0KOjEwMDU5MDAwM0Y0RjJDMzAzMTA1NzFGNzgxMTEwRkMwMTA5MjgwMDA1MA0KOjEwMDVBMDAwODJFMDgwOTM4MTAwMTA5Mjg1MDAxMDkyODQwMEIxOUFCRA0KOjEwMDVCMDAwODA5MTZGMDA4MjYwODA5MzZGMDBFODgxOEUyRjkwRTBDMQ0KOjEwMDVDMDAwRkMwMUVFMEZGRjFGRTgwRkY5MUZFQzUyRkU0RjgwODE3OA0KOjEwMDVEMDAwODA2NDgwODM4QUU1OTBFMDlFODc4RDg3NkFFNTcwRTA3RA0KOjEwMDVFMDAwQ0UwMTBFOTQwQzAyMEU5NDAwMDI2QkE3N0NBNzhEQTc3Rg0KOjEwMDVGMDAwOUVBNzhFRTE5MEUwOUU4RjhEOEY4MEVEOTdFMDk4ODc4Qg0KOjEwMDYwMDAwOEY4MzgwRTA5MEUwQTRFOEIyRTQ4OThGOUE4RkFCOEY2Qg0KOjEwMDYxMDAwQkM4RjhBRTE5OEVGQTJFQ0JERTM4RDhCOUU4QkFGOEJGNA0KOjEwMDYyMDAwQjg4RjFGOEUxOEEyMTlBMjFBQTI4REUyOTBFMDlDODNBNw0KOjEwMDYzMDAwOEI4MzE5OEExQThBMUI4QTFDOEExOTg2MUE4NjFCODYzQQ0KOjEwMDY0MDAwMUM4NjFFODIxRDgyMUZBMjE4QTZERjkxQ0Y5MTFGOTFDQQ0KOjEwMDY1MDAwMDg5NTYwOTExNDAzNzA5MTE1MDM4OUVGOTFFMDBFOTQ1MQ0KOjEwMDY2MDAwODgwMjYwOTExNjAzNzA5MTE3MDM4OEUyOTJFMDBFOTQ1RA0KOjEwMDY3MDAwODgwMjYwOTExODAzNzA5MTE5MDM4N0U1OTJFMDBFOTQ0Nw0KOjEwMDY4MDAwODgwMjYwOTExQTAzNzA5MTFCMDM4NkU4OTJFMDBDOTQzMw0KOjEwMDY5MDAwODgwMkNGOTJERjkyRUY5MkZGOTIwRjkzMUY5M0NGOTMzNg0KOjEwMDZBMDAwREY5M0VDMDE4QjAxMEU5NDAwMDI2QjAxN0MwMTI5QTUwNA0KOjEwMDZCMDAwM0FBNTEyMTYxMzA2MENGMDQyQzA4QkE1OUNBNUE2MDEwNA0KOjEwMDZDMDAwNDgxQjU5MEI0MjlGQzAwMTQzOUY5MDBENTI5RjkwMERCNA0KOjEwMDZEMDAwMTEyNDYxRTA3MEUwODgzRTIzRTA5MjA3MjRGMDY4RUU4OA0KOjEwMDZFMDAwNzNFMDBFOTRDNDA5OEQ4NTlFODU5ODAxMjgxQjM5MEJGMw0KOjEwMDZGMDAwMzdGRjAzQzAzMTk1MjE5NTMxMDk2MjE3NzMwN0ZDRjQ2OA0KOjEwMDcwMDAwMDgxNzE5MDcxQ0Y0NzE5NTYxOTU3MTA5ODYwRjk3MUZEOQ0KOjEwMDcxMDAwOUU4NzhEODdDQkE2RENBNkVEQTZGRUE2NkQ4NTdFODU4MQ0KOjEwMDcyMDAwOEY4NTk4ODk2ODBGNzkxRkNFMDFERjkxQ0Y5MTFGOTEzNg0KOjEwMDczMDAwMEY5MUZGOTBFRjkwREY5MENGOTAwQzk0MEMwMjFFODdFQQ0KOjEwMDc0MDAwMEQ4N0U4Q0ZEQzAxRUM5MThFMkY5MEUwRkMwMUVFMEZERA0KOjEwMDc1MDAwRkYxRkU4MEZGOTFGRUM1MkZFNEY4MDgxODZGRjAyQzA5OQ0KOjEwMDc2MDAwOEY3QjgwODMwODk1MUY5MjBGOTIwRkI2MEY5MjExMjRGMg0KOjEwMDc3MDAwMkY5MzNGOTM0RjkzNUY5MzZGOTM3RjkzOEY5MzlGOTNBOQ0KOjEwMDc4MDAwQUY5M0JGOTNFRjkzRkY5MzgwOTEzMzAxOTA5MTM0MDEyNg0KOjEwMDc5MDAwQTA5MTM1MDFCMDkxMzYwMTg5MkI4QTJCOEIyQkMxRjFBOQ0KOjEwMDdBMDAwOTA5MTMyMDE4MDkxMDAwMDg5Mjc4MDkzMDAwMDgwOTExMA0KOjEwMDdCMDAwMzMwMTkwOTEzNDAxQTA5MTM1MDFCMDkxMzYwMTE4MTZBMg0KOjEwMDdDMDAwMTkwNjFBMDYxQjA2OUNGNDgwOTEzMzAxOTA5MTM0MDE5RQ0KOjEwMDdEMDAwQTA5MTM1MDFCMDkxMzYwMTAxOTdBMTA5QjEwOTgwOTMyQg0KOjEwMDdFMDAwMzMwMTkwOTMzNDAxQTA5MzM1MDFCMDkzMzYwMUZGOTEwQQ0KOjEwMDdGMDAwRUY5MUJGOTFBRjkxOUY5MThGOTE3RjkxNkY5MTVGOTE5OQ0KOjEwMDgwMDAwNEY5MTNGOTEyRjkxMEY5MDBGQkUwRjkwMUY5MDE4OTUxMQ0KOjEwMDgxMDAwODA5MTAwMDFFQ0U3RjBFMEU0OTE5RkVGOTA5MzAwMDFGQw0KOjEwMDgyMDAwRTEzMDUxRjAzMEYwRTIzMDY5RjA2MEUwMEU5NEI0MDE1NA0KOjEwMDgzMDAwREVDRjEwOTI2RTAwRjlDRjkwOTE2RjAwOUQ3RjkwOTM2NA0KOjEwMDg0MDAwNkYwMEYzQ0Y5MDkxNzAwMDlEN0Y5MDkzNzAwMDkxRTBDNg0KOjEwMDg1MDAwOTA5M0IwMDA5MDkxQjEwMDk4N0Y5NDYwOTA5M0IxMDAxNA0KOjEwMDg2MDAwMTA5MkIzMDBFMkNGMUY5MjBGOTIwRkI2MEY5MjExMjQ5NQ0KOjEwMDg3MDAwMkY5MzNGOTM0RjkzNUY5MzZGOTM3RjkzOEY5MzlGOTNBOA0KOjEwMDg4MDAwQUY5M0JGOTNFRjkzRkY5Mzg3RTM5MUUwMEU5NDI1MDExRA0KOjEwMDg5MDAwRkY5MUVGOTFCRjkxQUY5MTlGOTE4RjkxN0Y5MTZGOTE1OA0KOjEwMDhBMDAwNUY5MTRGOTEzRjkxMkY5MTBGOTAwRkJFMEY5MDFGOTAyRQ0KOjEwMDhCMDAwMTg5NTFGOTIwRjkyMEZCNjBGOTIxMTI0MkY5MzhGOTNCQQ0KOjEwMDhDMDAwOUY5M0VGOTNGRjkzRTA5MTQ3MDFGMDkxNDgwMTgwODE1RQ0KOjEwMDhEMDAwRTA5MTREMDFGMDkxNEUwMTgyRkQxQkMwOTA4MTgwOTEwRA0KOjEwMDhFMDAwNTAwMThGNUY4RjczMjA5MTUxMDE4MjE3NDFGMEUwOTE4OQ0KOjEwMDhGMDAwNTAwMUYwRTBFOTVDRkU0Rjk1OEY4MDkzNTAwMUZGOTEyRA0KOjEwMDkwMDAwRUY5MTlGOTE4RjkxMkY5MTBGOTAwRkJFMEY5MDFGOTA5RA0KOjEwMDkxMDAwMTg5NTgwODFGNENGMUY5MjBGOTIwRkI2MEY5MjExMjQ3OQ0KOjEwMDkyMDAwMkY5MzNGOTM4RjkzOUY5M0FGOTNCRjkzODA5MTJFMDEwQg0KOjEwMDkzMDAwOTA5MTJGMDFBMDkxMzAwMUIwOTEzMTAxMzA5MTJEMDFBMg0KOjEwMDk0MDAwMjNFMDIzMEYyRDM3NThGNTAxOTZBMTFEQjExRDIwOTNFQg0KOjEwMDk1MDAwMkQwMTgwOTMyRTAxOTA5MzJGMDFBMDkzMzAwMUIwOTMyRA0KOjEwMDk2MDAwMzEwMTgwOTEyOTAxOTA5MTJBMDFBMDkxMkIwMUIwOTEzMA0KOjEwMDk3MDAwMkMwMTAxOTZBMTFEQjExRDgwOTMyOTAxOTA5MzJBMDE5Qw0KOjEwMDk4MDAwQTA5MzJCMDFCMDkzMkMwMUJGOTFBRjkxOUY5MThGOTFCOA0KOjEwMDk5MDAwM0Y5MTJGOTEwRjkwMEZCRTBGOTAxRjkwMTg5NTI2RTg1Mg0KOjEwMDlBMDAwMjMwRjAyOTZBMTFEQjExREQyQ0YxRjkyMEY5MjBGQjYzOQ0KOjEwMDlCMDAwMEY5MjExMjQwRjkwMEZCRTBGOTAxRjkwMTg5NTFGOTI0OQ0KOjEwMDlDMDAwMEY5MjBGQjYwRjkyMTEyNDJGOTMzRjkzNEY5MzVGOTM4Mw0KOjEwMDlEMDAwNkY5MzdGOTM4RjkzOUY5M0FGOTNCRjkzQ0Y5M0RGOTM0Nw0KOjEwMDlFMDAwRUY5M0ZGOTM4MDkxMjYwMUMwOTFGODAxRDBFMDg3RkYzQg0KOjEwMDlGMDAwMjRDMDEwOTI4NTAwMTA5Mjg0MDA4MDkxMjYwMThGNUZBMA0KOjEwMEEwMDAwODA5MzI2MDE4MDkxMjYwMTA4MkUwMDBDOTkwQjhDMTdFQg0KOjEwMEExMDAwOUQwNzI0RjQ4MDkxMjYwMThDMzBDNEYxODA5MTg0MDBEQw0KOjEwMEEyMDAwOTA5MTg1MDAwNDk2ODAzNDlDNDkwOEY0N0FDMDgwOTFBNg0KOjEwMEEzMDAwODQwMDkwOTE4NTAwMDQ5Njc2QzA4MDkxMjYwMTA4MkU0RQ0KOjEwMEE0MDAwMDAwQzk5MEI4QzE3OUQwN0M0RjZFMDkxMjYwMThFMkZBMA0KOjEwMEE1MDAwRUUwRjk5MEJGQzAxRUUwRkZGMUZFODBGRjkxRkVDNTI5MA0KOjEwMEE2MDAwRkU0RjgwODE4NkZGQzlDRkUwOTEyNjAxOEUyRkVFMEZDOQ0KOjEwMEE3MDAwOTkwQkZDMDFFRTBGRkYxRkU4MEZGOTFGRUM1MkZFNEYyMA0KOjEwMEE4MDAwODA4MTYwRTA4RjczMEU5NEI0MDFCN0NGMjA5MTg0MDAxMQ0KOjEwMEE5MDAwMzA5MTg1MDBFMDkxMjYwMThFMkZFRTBGOTkwQkZDMDExRA0KOjEwMEFBMDAwRUUwRkZGMUZFODBGRjkxRkVDNTJGRTRGODE4MTkyODE3Qw0KOjEwMEFCMDAwODIwRjkzMUY5MDkzODkwMDgwOTM4ODAwRTA5MTI2MDExNA0KOjEwMEFDMDAwOEUyRkVFMEY5OTBCRkMwMUVFMEZGRjFGRTgwRkY5MUZBMQ0KOjEwMEFEMDAwRUM1MkZFNEY4MDgxODZGRjExQzBFMDkxMjYwMThFMkZERg0KOjEwMEFFMDAwRUUwRjk5MEJGQzAxRUUwRkZGMUZFODBGRjkxRkVDNTIwMA0KOjEwMEFGMDAwRkU0RjgwODE2MUUwOEY3MzBFOTRCNDAxRkY5MUVGOTFGRQ0KOjEwMEIwMDAwREY5MUNGOTFCRjkxQUY5MTlGOTE4RjkxN0Y5MTZGOTEyNQ0KOjEwMEIxMDAwNUY5MTRGOTEzRjkxMkY5MTBGOTAwRkJFMEY5MDFGOTBCQg0KOjEwMEIyMDAwMTg5NTgwRTQ5Q0U5OTA5Mzg5MDA4MDkzODgwMDhGRUY2QQ0KOjEwMEIzMDAwODA5MzI2MDFFM0NGMTA5MjNBMDExMDkyMzkwMTg4RUU5QQ0KOjEwMEI0MDAwOTNFMEEwRTBCMEUwODA5MzNCMDE5MDkzM0MwMUEwOTM0MA0KOjEwMEI1MDAwM0QwMUIwOTMzRTAxOERFMDkxRTA5MDkzMzgwMTgwOTM4OA0KOjEwMEI2MDAwMzcwMTg1RUM5MEUwOTA5MzQ0MDE4MDkzNDMwMTg0RUMzRA0KOjEwMEI3MDAwOTBFMDkwOTM0NjAxODA5MzQ1MDE4MEVDOTBFMDkwOTM0Mw0KOjEwMEI4MDAwNDgwMTgwOTM0NzAxODFFQzkwRTA5MDkzNEEwMTgwOTM2Mw0KOjEwMEI5MDAwNDkwMTgyRUM5MEUwOTA5MzRDMDE4MDkzNEIwMTg2RUNFQw0KOjEwMEJBMDAwOTBFMDkwOTM0RTAxODA5MzREMDExMDkyNTAwMTEwOTI2RA0KOjEwMEJCMDAwNTEwMTEwOTI1MjAxMTA5MjUzMDFFOUVGRjFFMDJGRUYzMQ0KOjEwMEJDMDAwNDhFQjVCRTA4MDkxRjgwMThDMzBEOEY0OTFFMDk4MEYwRA0KOjEwMEJEMDAwOTA5M0Y4MDE4MDgzOTBFMERDMDFBQTBGQkIxRkE4MEY1Rg0KOjEwMEJFMDAwQjkxRkFDNTJCRTRGMTI5NjVDOTM0RTkzMTE5NzEwOEE2OA0KOjEwMEJGMDAwMTc4NjEyQTYxMUE2QkY5NjgyRTBFNTNCRjgwNzExRjcwQg0KOjEwMEMwMDAwMDg5NTIwODNGNENGQ0Y5M0RGOTNDREI3REVCNzI4OTczNQ0KOjEwMEMxMDAwMEZCNkY4OTRERUJGMEZCRUNEQkY3ODk0ODRCNTgyNjA2Ng0KOjEwMEMyMDAwODRCRDg0QjU4MTYwODRCRDg1QjU4MjYwODVCRDg1QjU5MA0KOjEwMEMzMDAwODE2MDg1QkQ4MDkxNkUwMDgxNjA4MDkzNkUwMDEwOTIwRQ0KOjEwMEM0MDAwODEwMDgwOTE4MTAwODI2MDgwOTM4MTAwODA5MTgxMDA4OQ0KOjEwMEM1MDAwODE2MDgwOTM4MTAwODA5MTgwMDA4MTYwODA5MzgwMDAxQQ0KOjEwMEM2MDAwODA5MUIxMDA4NDYwODA5M0IxMDA4MDkxQjAwMDgxNjA3OA0KOjEwMEM3MDAwODA5M0IwMDA4MDkxN0EwMDg0NjA4MDkzN0EwMDgwOTFBNA0KOjEwMEM4MDAwN0EwMDgyNjA4MDkzN0EwMDgwOTE3QTAwODE2MDgwOTNGQw0KOjEwMEM5MDAwN0EwMDgwOTE3QTAwODA2ODgwOTM3QTAwMTA5MkMxMDA3Nw0KOjEwMENBMDAwODJFMDkwRTA5MDkzMTUwMzgwOTMxNDAzODNFMDkwRTAzQQ0KOjEwMENCMDAwOTA5MzE3MDM4MDkzMTYwMzg0RTA5MEUwOTA5MzE5MDNCOA0KOjEwMENDMDAwODA5MzE4MDM4NUUwOTBFMDkwOTMxQjAzODA5MzFBMDNCMA0KOjEwMENEMDAwMEU5NDI5MDMxMDkyM0UwMzM5RUZFMzJFMzFFMEYzMkVGOA0KOjEwMENFMDAwMTBFMDAwRTBDODAxMEU5NEFBMDc5MEUwODEzODkxMDU1OQ0KOjEwMENGMDAwMENGMDlBOTVGNzAxOTA4Qjg3ODcwRjVGMUY0RkZGRTJFQg0KOjEwMEQwMDAwRUYwRUYxMUMwNDMwMTEwNTY5Rjc4REUwOTBFMDkwOTMyRg0KOjEwMEQxMDAwMjUwMzgwOTMyNDAzMEU5NDg4MDA4MDkxM0UwMzgxMTE2Mw0KOjEwMEQyMDAwMERDMTg4RTBFMUUwRjFFMERFMDExMTk2MDE5MDBEOTI0NQ0KOjEwMEQzMDAwOEE5NUUxRjcwRTk0MjkwMzgwOTEzRTAzODExMTEwOTI2OA0KOjEwMEQ0MDAwM0UwMzBFOTQwMDAyNkM1MDdFNEY4RjRGOUY0RjYwOTM3Ng0KOjEwMEQ1MDAwMjYwMzcwOTMyNzAzODA5MzI4MDM5MDkzMjkwMzhFMDEyMQ0KOjEwMEQ2MDAwMEY1RjFGNEY1RTAxODlFMEE4MEVCMTFDOUVFMkM5MkVFNQ0KOjEwMEQ3MDAwOTNFMEQ5MkUyOUVGRTIyRTIxRTBGMjJFRjgwMTYxOTFDNQ0KOjEwMEQ4MDAwNzE5MThGMDFGNzAxODU4NTk2ODU2ODFCNzkwQjA3MkU3OA0KOjEwMEQ5MDAwMDAwQzg4MEI5OTBCMEU5NDJDMDkyMEUwMzBFMDQ4RTRGRA0KOjEwMERBMDAwNTJFNDBFOTQ4MjA4RjYwMTYxOTM3MTkzODE5MzkxOTNCQQ0KOjEwMERCMDAwNkYwMUZGRTJFRjBFRjExQzBBMTUxQjA1RjlGNjBFOTQwOA0KOjEwMERDMDAwMDAwMjAwOTEyNjAzMTA5MTI3MDMyMDkxMjgwMzMwOTFGRg0KOjEwMEREMDAwMjkwMzYwMTc3MTA3ODIwNzkzMDcwOEYwNzVDMDBFOTQwNg0KOjEwMERFMDAwMDAwMjY2NUY3RjRGOEY0RjlGNEY2MDkzMkEwMzcwOTM3Rg0KOjEwMERGMDAwMkIwMzgwOTMyQzAzOTA5MzJEMDM4RUUyRTgyRTgzRTA0Nw0KOjEwMEUwMDAwRjgyRTA5RUYxMUUwRjcwMTgxOTA5MTkwQTE5MEIxOTAzNw0KOjEwMEUxMDAwN0YwMUY4MDE2NTg1NzY4NTA3MkUwMDBDODgwQjk5MEJGQw0KOjEwMEUyMDAwMEU5NDJDMDlBNTAxOTQwMTBFOTQxNjA4MEU5NEY0MDg1Mg0KOjEwMEUzMDAwQzgwMTBFOTQ0OTAzMDE1RDFGNEZGMkUwMDUzQjFGMDdGNw0KOjEwMEU0MDAwMTFGNzBFOTQwMDAyMDA5MTJBMDMxMDkxMkIwMzIwOTFCOA0KOjEwMEU1MDAwMkMwMzMwOTEyRDAzNjAxNzcxMDc4MjA3OTMwNzg4RjNFNQ0KOjEwMEU2MDAwQUVDRjg5RUY5MUUwMEU5NDQ5MDM2QjgxN0M4MTg4RTJEQg0KOjEwMEU3MDAwOTJFMDBFOTQ0OTAzNkQ4MTdFODE4N0U1OTJFMDBFOTRBNQ0KOjEwMEU4MDAwNDkwMzZGODE3ODg1ODZFODkyRTAwRTk0NDkwMzBFOTRCOQ0KOjEwMEU5MDAwMDAwMjY2NUY3RjRGOEY0RjlGNEY2MDkzMkEwMzcwOTNDRQ0KOjEwMEVBMDAwMkIwMzgwOTMyQzAzOTA5MzJEMDMwRTk0MDAwMjAwOTE0QQ0KOjEwMEVCMDAwMkEwMzEwOTEyQjAzMjA5MTJDMDMzMDkxMkQwMzYwMTdFRQ0KOjEwMEVDMDAwNzEwNzgyMDc5MzA3ODhGMzY5ODE3QTgxODA5MTA2MDIwRQ0KOjEwMEVEMDAwOTA5MTA3MDI2ODE3NzkwNzIxRjYyQjgxM0M4MTgwOTE1OA0KOjEwMEVFMDAwMzUwMjkwOTEzNjAyMjgxNzM5MDcwOUYwQkFDRjJEODFDMw0KOjEwMEVGMDAwM0U4MTgwOTE2NDAyOTA5MTY1MDIyODE3MzkwNzA5RjBCQw0KOjEwMEYwMDAwQjBDRjJGODEzODg1ODA5MTkzMDI5MDkxOTQwMjI4MTc1OQ0KOjEwMEYxMDAwMzkwNzA5RjBBNkNGODlFRjkxRTAwRTk0QTIwMzg4RTI4OQ0KOjEwMEYyMDAwOTJFMDBFOTRBMjAzODdFNTkyRTAwRTk0QTIwMzg2RTg3NQ0KOjEwMEYzMDAwOTJFMDBFOTRBMjAzODFFMDgwOTMzRTAzMDBFMDEwRTA3Mw0KOjEwMEY0MDAwMDExNTExMDVFOUYzMEU5NDExMDE4ODIzQzlGMzBFOTREQw0KOjEwMEY1MDAwMDAwMEY2Q0ZGOTk5RkVDRjkyQkQ4MUJERjg5QTk5Mjc4RQ0KOjEwMEY2MDAwODBCNTA4OTUwNTJFOTdGQjFFRjQwMDk0MEU5NEM5MDdEMg0KOjEwMEY3MDAwNTdGRDA3RDAwRTk0RTQwNzA3RkMwM0QwNEVGNDBDOTQwMQ0KOjEwMEY4MDAwQzkwNzUwOTU0MDk1MzA5NTIxOTUzRjRGNEY0RjVGNEY4Mg0KOjEwMEY5MDAwMDg5NTkwOTU4MDk1NzA5NTYxOTU3RjRGOEY0RjlGNEZFNQ0KOjEwMEZBMDAwMDg5NTBFOTQwNjA4QTU5RjkwMERCNDlGOTAwREE0OUZFMA0KOjEwMEZCMDAwODAwRDkxMUQxMTI0MDg5NUI3RkYwQzk0RDEwNzBFOTQ1NA0KOjEwMEZDMDAwRDEwNzgyMUI5MzBCMDg5NUExRTIxQTJFQUExQkJCMUIwQg0KOjEwMEZEMDAwRkQwMTBEQzBBQTFGQkIxRkVFMUZGRjFGQTIxN0IzMDcwNQ0KOjEwMEZFMDAwRTQwN0Y1MDcyMEYwQTIxQkIzMEJFNDBCRjUwQjY2MUYxQg0KOjEwMEZGMDAwNzcxRjg4MUY5OTFGMUE5NDY5Rjc2MDk1NzA5NTgwOTVERg0KOjEwMTAwMDAwOTA5NTlCMDFBQzAxQkQwMUNGMDEwODk1QTI5RkIwMDE1NQ0KOjEwMTAxMDAwQjM5RkMwMDFBMzlGNzAwRDgxMUQxMTI0OTExREIyOUYyQw0KOjEwMTAyMDAwNzAwRDgxMUQxMTI0OTExRDA4OTU1MDU4QkIyN0FBMjdDQQ0KOjEwMTAzMDAwMEU5NDJEMDgwQzk0N0UwOTBFOTQ3MDA5MzhGMDBFOTRDRA0KOjEwMTA0MDAwNzcwOTIwRjAzOUY0OUYzRjE5RjQyNkY0MEM5NDZEMDlDOA0KOjEwMTA1MDAwMEVGNEUwOTVFN0ZCMEM5NDY3MDlFOTJGMEU5NDhGMDlENQ0KOjEwMTA2MDAwNThGM0JBMTc2MjA3NzMwNzg0MDc5NTA3MjBGMDc5RjRERA0KOjEwMTA3MDAwQTZGNTBDOTRCMTA5MEVGNEUwOTUwQjJFQkEyRkEwMkQxNQ0KOjEwMTA4MDAwMEIwMUI5MDE5MDAxMEMwMUNBMDFBMDAxMTEyNEZGMjczNQ0KOjEwMTA5MDAwNTkxQjk5RjA1OTNGNTBGNDUwM0U2OEYxMUExNkYwNDAzMA0KOjEwMTBBMDAwQTIyRjIzMkYzNDJGNDQyNzU4NUZGM0NGNDY5NTM3OTUyRg0KOjEwMTBCMDAwMjc5NUE3OTVGMDQwNTM5NUM5Rjc3RUY0MUYxNkJBMEJGNA0KOjEwMTBDMDAwNjIwQjczMEI4NDBCQkFGMDkxNTBBMUYwRkYwRkJCMUZBMg0KOjEwMTBEMDAwNjYxRjc3MUY4ODFGQzJGNzBFQzBCQTBGNjIxRjczMUZFQg0KOjEwMTBFMDAwODQxRjQ4RjQ4Nzk1Nzc5NTY3OTVCNzk1Rjc5NTlFM0Y0OA0KOjEwMTBGMDAwMDhGMEIwQ0Y5Mzk1ODgwRjA4RjA5OTI3RUUwRjk3OTVEOQ0KOjEwMTEwMDAwODc5NTA4OTUwRTk0OTYwODBDOTQ3RTA5MEU5NDc3MDk5RA0KOjEwMTExMDAwNThGMDBFOTQ3MDA5NDBGMDI5RjQ1RjNGMjlGMDBDOTRDOA0KOjEwMTEyMDAwNjcwOTUxMTEwQzk0QjIwOTBDOTQ2RDA5MEU5NDhGMDk0Mg0KOjEwMTEzMDAwNjhGMzk5MjNCMUYzNTUyMzkxRjM5NTFCNTUwQkJCMjcwNg0KOjEwMTE0MDAwQUEyNzYyMTc3MzA3ODQwNzM4RjA5RjVGNUY0RjIyMEY0Qg0KOjEwMTE1MDAwMzMxRjQ0MUZBQTFGQTlGMzM1RDAwRTJFM0FGMEUwRTg0Mg0KOjEwMTE2MDAwMzJEMDkxNTA1MDQwRTY5NTAwMUNDQUY3MkJEMEZFMkY4Qw0KOjEwMTE3MDAwMjlEMDY2MEY3NzFGODgxRkJCMUYyNjE3MzcwNzQ4MDcyMA0KOjEwMTE4MDAwQUIwN0IwRTgwOUYwQkIwQjgwMkRCRjAxRkYyNzkzNThEOA0KOjEwMTE5MDAwNUY0RjNBRjA5RTNGNTEwNTc4RjAwQzk0NjcwOTBDOTQyQw0KOjEwMTFBMDAwQjIwOTVGM0ZFNEYzOTgzRUQ0RjM4Njk1Nzc5NTY3OTU0Rg0KOjEwMTFCMDAwQjc5NUY3OTU5RjVGQzlGNzg4MEY5MTFEOTY5NTg3OTUwRA0KOjEwMTFDMDAwOTdGOTA4OTVFMUUwNjYwRjc3MUY4ODFGQkIxRjYyMTcyQw0KOjEwMTFEMDAwNzMwNzg0MDdCQTA3MjBGMDYyMUI3MzBCODQwQkJBMEJFQQ0KOjEwMTFFMDAwRUUxRjg4RjdFMDk1MDg5NTBFOTRGQjA4Njg5NEIxMTFGRQ0KOjEwMTFGMDAwMEM5NEIyMDkwODk1MEU5NDk3MDk4OEYwOUY1Nzk4RjBCRg0KOjEwMTIwMDAwQjkyRjk5MjdCNzUxQjBGMEUxRjA2NjBGNzcxRjg4MUYwQg0KOjEwMTIxMDAwOTkxRjFBRjBCQTk1QzlGNzE0QzBCMTMwOTFGMDBFOTQyNQ0KOjEwMTIyMDAwQjEwOUIxRTAwODk1MEM5NEIxMDk2NzJGNzgyRjg4Mjc5MA0KOjEwMTIzMDAwQjg1RjM5RjBCOTNGQ0NGMzg2OTU3Nzk1Njc5NUIzOTU0Qw0KOjEwMTI0MDAwRDlGNzNFRjQ5MDk1ODA5NTcwOTU2MTk1N0Y0RjhGNEZCQg0KOjEwMTI1MDAwOUY0RjA4OTVFODk0MDlDMDk3RkIzRUY0OTA5NTgwOTVDMA0KOjEwMTI2MDAwNzA5NTYxOTU3RjRGOEY0RjlGNEY5OTIzQTlGMEY5MkY2Qw0KOjEwMTI3MDAwOTZFOUJCMjc5Mzk1RjY5NTg3OTU3Nzk1Njc5NUI3OTVFQQ0KOjEwMTI4MDAwRjExMUY4Q0ZGQUY0QkIwRjExRjQ2MEZGMUJDMDZGNUZEMA0KOjEwMTI5MDAwN0Y0RjhGNEY5RjRGMTZDMDg4MjMxMUYwOTZFOTExQzBFMg0KOjEwMTJBMDAwNzcyMzIxRjA5RUU4ODcyRjc2MkYwNUMwNjYyMzcxRjAwMw0KOjEwMTJCMDAwOTZFODg2MkY3MEUwNjBFMDJBRjA5QTk1NjYwRjc3MUYxNw0KOjEwMTJDMDAwODgxRkRBRjc4ODBGOTY5NTg3OTU5N0Y5MDg5NTk3RjkwQg0KOjEwMTJEMDAwOUY2NzgwRTg3MEUwNjBFMDA4OTU5RkVGODBFQzA4OTVEQw0KOjEwMTJFMDAwMDAyNDBBOTQxNjE2MTcwNjE4MDYwOTA2MDg5NTAwMjQwNQ0KOjEwMTJGMDAwMEE5NDEyMTYxMzA2MTQwNjA1MDYwODk1MDkyRTAzOTQ3Rg0KOjEwMTMwMDAwMDAwQzExRjQ4ODIzNTJGMEJCMEY0MEY0QkYyQjExRjRGMg0KOjEwMTMxMDAwNjBGRjA0QzA2RjVGN0Y0RjhGNEY5RjRGMDg5NTU3RkQ1MQ0KOjEwMTMyMDAwOTA1ODQ0MEY1NTFGNTlGMDVGM0Y3MUYwNDc5NTg4MEY1Mw0KOjEwMTMzMDAwOTdGQjk5MUY2MUYwOUYzRjc5RjA4Nzk1MDg5NTEyMTZFQQ0KOjEwMTM0MDAwMTMwNjE0MDY1NTFGRjJDRjQ2OTVGMURGMDhDMDE2MTY5Ng0KOjEwMTM1MDAwMTcwNjE4MDY5OTFGRjFDRjg2OTU3MTA1NjEwNTA4OTQ0Nw0KOjEwMTM2MDAwMDg5NUU4OTRCQjI3NjYyNzc3MjdDQjAxOTdGOTA4OTU1RQ0KOjEwMTM3MDAwOTkxQjc5RTAwNEMwOTkxRjk2MTcwOEYwOTYxQjg4MUZFNw0KOjEwMTM4MDAwN0E5NUM5Rjc4MDk1MDg5NTk3RkIwNzJFMTZGNDAwOTQ3Nw0KOjEwMTM5MDAwMDdEMDc3RkQwOUQwMEU5NEQ4MDkwN0ZDMDVEMDNFRjQ5Qw0KOjEwMTNBMDAwOTA5NTgxOTU5RjRGMDg5NTcwOTU2MTk1N0Y0RjA4OTUxMQ0KOjEwMTNCMDAwQUExQkJCMUI1MUUxMDdDMEFBMUZCQjFGQTYxN0I3MDc3Qg0KOjEwMTNDMDAwMTBGMEE2MUJCNzBCODgxRjk5MUY1QTk1QTlGNzgwOTU5Nw0KOjEwMTNEMDAwOTA5NUJDMDFDRDAxMDg5NUVFMEZGRjFGMDU5MEY0OTE4Qg0KOjA4MTNFMDAwRTAyRDA5OTRGODk0RkZDRjAxDQo6MTAxM0U4MDBGRjVBMDA1QTAwNUEwMDVBMDAwMDAwMDAwMDQ3MDFBNzlGDQo6MEMxM0Y4MDAwMEQ0MDA5NDAxMDUwMUUzMDBGNzAwMDBBMA0KOjAwMDAwMDAxRkYNCg==',
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            error: '',
            agentStatus: false,
            channelStatus: false,
            serialDevices: [],
            agentInfo: '',
            serialPortOpen: '',
            serialInput: '',
            supportedBoards: [],

            compileStatus: '',
            compileError: '',
            compile_error: '',
            compile_success: '',
            compile_hex: '',
            compile_msg: '',

            uploadStatus: '',
            uploadError: '',
            upload_error:'',
            upload_success: '',
            uploadingPort: '',
            upload_msg: '',

            status_class: 'none'
        };
        this.handleChangeSerial = this.handleChangeSerial.bind(this);
        this.showError = this.showError.bind(this);
        this.clearError = this.clearError.bind(this);
        this.handleCompile = this.handleCompile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentWillMount() {
        console.log("Re-Render")
    }

    componentDidMount() {
        daemon.agentFound.subscribe(status => {
            this.setState({
                agentStatus: status,
                agentInfo: JSON.stringify(daemon.agentInfo, null, 2)
            });
        });

        daemon.channelOpen.subscribe(status => {
            this.setState({channelStatus: status});
        });

        daemon.error.subscribe(this.showError);

        daemon.uploadingError.subscribe(this.showError);

        daemon.devicesList.subscribe(({serial, network}) => this.setState({
            serialDevices: serial,
            networkDevices: network
        }));

        daemon.supportedBoards.subscribe(boards => this.setState({
            supportedBoards: boards
        }));

        daemon.uploading.subscribe(upload => {
            this.setState({uploadStatus: upload.status, uploadError: upload.err});
            // console.log(upload);
        });
    }

    showError(err) {
        this.setState({error: err});
        scrollToBottom(document.body);
    }

    clearError() {
        this.setState({error: ''});
    }

    handleChangeSerial(e) {
        this.setState({serialInput: e.target.value});
    }

    setSelectedPort(e) {
        this.setState({
            selectedPort: e.target.value
        })
    }

    setImageStatus(status) {
        switch (status) {
            case 'progress':
                if (this.state.status_class !== 'progress_image') {
                    this.setState({status_class: 'progress_image'});
                }
                break;
            case 'success':
                if (this.state.status_class !== 'success_image') {
                    this.setState({status_class: 'success_image'});
                }
                break;
            case 'error':
                if (this.state.status_class !== 'error_image') {
                    this.setState({status_class: 'error_image'});
                }
                break;
            default:
                console.log('DEFAULT');
        }
    }

    /**
     * Compiling INO file
     */
    handleCompile() {
        var myHeaders = new Headers();
        var brd_info = "";
        myHeaders.append("Content-Type", "application/json");
        brd_info = $("#boards").val()
        var upload_str = profile[brd_info]['upload_arg'];
        const card_code = {
            "sketch": window.btoa($("#pre_previewArduino").text()),
            "fqbn": upload_str,
            "ext": "hex"
        }
        if (upload_str.includes('esp8266') || upload_str.includes('esp32')) {
            card_code.ext = 'bin';
        }

        this.setImageStatus('progress');
        document.getElementById("compile-button").disabled = true;
        document.getElementById("compile-button").textContent = 'Compiling...';
        document.getElementById("error").innerText = '';

        // Compile the Sketch.
        fetch(compiler_url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(card_code)
        })
            .then(result => {
                return result.json();
            })
            .then(data => {
                this.setState({
                    compile_error: data.error,
                    compile_hex: data.hexCode,
                    compile_success: data.success
                });
                if (this.state.compile_success) {
                    this.setImageStatus('success');
                    //this.handleUpload();
                } else {
                    this.setImageStatus('error');
                    document.getElementById("error").innerText = data.error;
                }
                document.getElementById("compile-button").disabled = false;
                document.getElementById("compile-button").textContent = 'Compile';
            })
            .catch(error => {
                console.log('ERROR: ', error.message);
                console.log('Compile error: ', this.state.compile_error);
                this.setImageStatus('error');
                return Promise.reject()
            })
    }

    /**
     * Uploading HEX/BIN file
     */
    handleUpload() {
        this.setImageStatus('progress');
        document.getElementById("upload-button").disabled = true;
        document.getElementById("upload-button").textContent = 'Uploading...';
        document.getElementById("error").innerText = '';
        const target = {
            board: $("#boards").val(),
            port: this.state.selectedPort,
            network: false
        };
        this.setState({uploadingPort: target.port});
        daemon.boardPortAfterUpload.subscribe(portStatus => {
            if (portStatus.hasChanged) {
                console.log('Port changed');
                this.setState({uploadingPort: portStatus.newPort});
            }
        });
        // Upload a Compiled Sketch.
        if (this.state.compile_success) {
            daemon.uploadSerial(target, 'otto_blockly', {hex: this.state.compile_hex});
            this.setImageStatus('success');
            document.getElementById("upload-button").disabled = false;
            document.getElementById("upload-button").textContent = 'Upload';
        } else {
            //this.setState({compile_msg: this.state.compile_error});
            this.setImageStatus('error');
        }
    }

    render() {
        const listSerialDevices = this.state.serialDevices.map((device, i) => <li key={i}>
            {device.Name} - IsOpen: <span className={device.IsOpen ? 'open' : 'closed'}>
        {device.IsOpen ? 'true' : 'false'}
      </span>
        </li>);

        const supportedBoards = this.state.supportedBoards.map((board, i) => <li key={i}>
            {board}
        </li>);

        if (this.state.uploadStatus === daemon.UPLOAD_DONE) {
            document.getElementById("upload-button").textContent = 'Upload';
            uploadClass = 'success';
            this.setImageStatus('success');
        } else if (this.state.uploadStatus === daemon.UPLOAD_ERROR) {
            uploadClass = 'error';
            this.setImageStatus('error');
        } else if (this.state.uploadStatus === daemon.UPLOAD_IN_PROGRESS) {
            document.getElementById("upload-button").textContent = 'Uploading...';
            uploadClass = 'in-progress';
            this.setImageStatus('progress');
        }

        return (
            <div>
                <div className="section">
                    <table border="0px" width="100%">
                        <tbody>
                        <tr>
                            <td width="20%">
                                <img src="./media/logo.svg" width="200px"/>
                            </td>
                            <td align="right">
                                <div className={"parent"}>
                                    <img className={this.state.status_class} height={"40px"} width={"40px"}/>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="section">
                    <p>
                        Agent Installed:
                        <span
                            className={this.state.agentStatus ? 'found' : 'not-found'}> {this.state.agentStatus ? 'Yes' : 'No'} </span>
                    </p>
                    <p>
                        Agent Connected:
                        <span
                            className={this.state.channelStatus ? 'found' : 'not-found'}> {this.state.channelStatus ? 'Yes' : 'No'} </span>
                    </p>
                    {/* <div className="section"> */}
                    <h5>Connected Devices</h5>

                    {/* <strong>serial:</strong> */}
                    <select onChange={(e) => this.setSelectedPort(e)}>
                        <option value=""> Select Port</option>
                        {
                            this.state.serialDevices && this.state.serialDevices.map(item => <option
                                value={item.Name}>{item.Name}</option>)
                        }
                    </select>

                    <p></p>
                    <p id="error">{this.state.compile_msg}</p>
                    {/* </div> */}
                </div>

                <div className="section">
                    { /*<p>Compile and Upload to  {$("#boards").val()} at {this.state.selectedPort}</p> */}
                    <div><strong>Board
                        :</strong> {(this.state.channelStatus && $("#boards").find('option:selected').text()) || '-'}
                    </div>
                    <div><strong>Port:</strong> {this.state.selectedPort || '-'}</div>
                    <p></p>
                    <div>
                        <table>
                            <tr>
                                <td align={"left"}>
                                    <button id="compile-button" onClick={this.handleCompile}
                                        disabled={!this.state.selectedPort || this.state.uploadStatus === daemon.COMPILE_IN_PROGRESS}>Compile
                                    </button>
                                </td>
                                <td align={"right"}>
                                    <button id="upload-button" onClick={this.handleUpload}
                                            disabled={!this.state.selectedPort || this.state.uploadStatus === daemon.UPLOAD_IN_PROGRESS || !this.state.compile_success}>Upload
                                    </button>

                                </td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>
                    <div>
                        Upload status:
                        <span id="uploadStatus" className={uploadClass}> {m_stat[this.state.uploadStatus]}</span>
                        <span>{this.state.uploadError}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
