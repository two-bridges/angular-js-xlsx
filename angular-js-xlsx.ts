'use strict';

/// <reference path="./node_modules/@types/angular/index.d.ts" />
/// <reference path="./node_modules/@types/jquery/index.d.ts" />
declare var XLS: any;

angular.module('angular-js-xlsx', [])
    .directive('jsXls', function () {
        return {
            restrict: 'E',
            template: '<input type="file" />',
            replace: true,
            scope: {
                xlsxReadOptions: '='
            },
            link: function (scope: angular.IScope, element: angular.IRootElementService, attrs: angular.IAttributes) {

                function handleSelect() {
                    var files = this.files;
                    for (var i = 0, f = files[i]; i != files.length; ++i) {
                        let reader = new FileReader();
                        reader.result
                        var name = f.name;
                        reader.onload = function (e) {
                            if (!e) {
                                var data = (<any>reader).content;
                            } else {
                                var data = (<any>e.target).result;
                            }

                            /* if binary string, read with type 'binary' */
                            try {
                                var workbook = XLS.read(data, { type: 'binary' });

                                if (attrs.onread) {
                                    var handleRead = scope[attrs.onread];
                                    if (typeof handleRead === "function") {
                                        handleRead(workbook);
                                    }
                                }

                            } catch (e) {
                                if (attrs.onerror) {
                                    var handleError = scope[attrs.onerror];
                                    if (typeof handleError === "function") {
                                        handleError(e);
                                        // test
                                    }
                                }
                            }

                            // Clear input file
                            element.val('');
                        };

                        //extend FileReader
                        if (!FileReader.prototype.readAsBinaryString) {
                            FileReader.prototype.readAsBinaryString = function (fileData) {
                                var binary = "";
                                var pt = this;
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    var bytes = new Uint8Array(reader.result);
                                    var length = bytes.byteLength;
                                    for (var i = 0; i < length; i++) {
                                        binary += String.fromCharCode(bytes[i]);
                                    }

                                    //pt.result  - readonly so assign binary
                                    pt.content = binary;
                                    $(pt).trigger('onload');
                                }
                                reader.readAsArrayBuffer(fileData);
                            }
                        }

                        reader.readAsBinaryString(f);

                    }
                }

                element.on('change', handleSelect);
            }
        };
    });
