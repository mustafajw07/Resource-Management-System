import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RequisitionFormComponent } from '../requisition-form/requisition-form.component';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-requisition-table',
    templateUrl: './requisition-table.component.html',
    imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ButtonModule, DialogModule, RequisitionFormComponent],
})
export class RequisitionTableComponent implements OnInit {
    protected headers = [
        { field: 'id', header: 'ID' },
        { field: 'requisitionDate', header: 'Requisition Date' },
        { field: 'projectId', header: 'Project ID' },
        { field: 'requisitionType', header: 'Requisition Type' },
        { field: 'requisitionStage', header: 'Requisition Stage' },
        { field: 'hiringPoc', header: 'Hiring POC' },
        { field: 'clientPoc', header: 'Client POC' },
        { field: 'fulfillmentMedium', header: 'Fulfillment Medium' },
        { field: 'urgency', header: 'Urgency' },
        { field: 'requisitionStatus', header: 'Requisition Status' },
        { field: 'fteHeadCount', header: 'FTE Head Count' },
        { field: 'fteTotalAllocation', header: 'FTE Total Allocation' },
        { field: 'fulfilledAllocation', header: 'Fulfilled Allocation' },
        { field: 'notes', header: 'Notes' },
        { field: 'tentativeOnboardingDate', header: 'Tentative Onboarding Date' },
        { field: 'ageingDays', header: 'Ageing Days' },
        { field: 'capabilityArea', header: 'Capability Area' },
    ];
    protected requisitions = [];
    protected popupHeader = '';
    protected loading = false;
    protected visible = false;

    ngOnInit(): void { }

    /**
     * Utility to safely get nested field values
     * @param obj The object to retrieve the value from
     * @param path The dot-separated path string
     * @returns The value at the specified path or an empty string if not found
    */
    protected getFieldValue(obj: any, path: string): any {
        if (!obj || !path) return '';
        return path.split('.').reduce((acc: any, key: string) => {
            if (acc === null || acc === undefined) return '';
            return acc[key];
        }, obj) ?? '';
    }

    /**
     * Opens the dialog to add a new requisition
     * @return void
     */
    protected addRequisition() {
        this.popupHeader = "New Project Requisition";
        this.visible = true;
    }

    /**
     * Handles the form submission from the requisition form
     * @param payload 
     * @return void
     */
    protected handleFormSubmitted(payload: any) {
        console.log('Requisition form submitted:', payload);
        this.visible = false;
    }

}
