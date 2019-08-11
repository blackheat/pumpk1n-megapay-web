import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    API_INVENTORY, API_INVENTORY_IMPORT, API_INVENTORY_EXPORT
} from '../shared/constants';
@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    searchByNavbar = '';
    searchNavBarEvent: EventEmitter<any> = new EventEmitter();
    cartChange: EventEmitter<any> = new EventEmitter();
    constructor(private httpClient: HttpClient) { }

    headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: '*/*' });

    getInventoryById(id: number) {
        return this.httpClient.get(`${API_INVENTORY}/${id}`);
    }

    getSearchFilter(
        page: number,
        productsPerPage: number,
        filter?
    ) {
        let queryParam = `${API_INVENTORY}?page=${page}&count=${productsPerPage}`;

        filter.productId > 0 ? (queryParam = `${queryParam}&ProductId=${filter.productId}`) : null;
        filter.productName && filter.productName.trim() ? (queryParam = `${queryParam}&ProductName=${filter.productName.trim()}`) : null;
        filter.supplierId > 0 ? (queryParam = `${queryParam}&SupplierId=${filter.supplierId}`) : null;
        filter.supplierName && filter.supplierName.trim() ? (queryParam = `${queryParam}&SupplierName=${filter.supplierName.trim()}`) : null;

        return this.httpClient.get(queryParam);
    }

    importInventory(product, supplier, value) {
        const self = this;
        const inventoryItems = [];
        const identifiers = value.productUniqueIdentifier.trim().split(',');
        identifiers.forEach(iden => {
            if (iden && iden.trim()) {
                inventoryItems.push({
                    productId: product.id,
                    supplierId: supplier.id,
                    productUniqueIdentifier: iden.trim()
                });
            }
        });
        const body = {
            inventoryItems: inventoryItems,
            importedDate: (new Date()).toDateString()
        }

        return self.httpClient.post(`${API_INVENTORY_IMPORT}`, body, { headers: self.headers });
    }

    exportInventory(value) {
        const self = this;
        const body = {
            customerId: value.customerId || null,
            exportedDate: (new Date()).toDateString(),
            inventoryItems: [value.id],
        }

        return self.httpClient.post(`${API_INVENTORY_EXPORT}`, body, { headers: self.headers });
    }
}
