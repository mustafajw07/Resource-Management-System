import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Store, StoreModule } from '@ngrx/store';
import { selectAllReferenceData } from '../../../store/reference-data/reference-data.selectors';
import { UserService } from '@core/services/user.service';
import { ClientService } from '@core/services/client.service';
import { ProjectService } from '@core/services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CommonModule, FormsModule, AutoCompleteModule, StoreModule],
})
export class RequisitionFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  private store = inject(Store);
  private referenceLists: Record<string, string[]> = {};
  protected requisitionTypes: string[] = [""];
  protected requisitionStages: string[] = [];
  protected urgencies: string[] = [];
  protected skill: string[] = [];
  protected capability: string[] = [];
  protected fulfillmentMedium: string[] = [];
  protected requisitionStatus: string[] = [];
  protected form: FormGroup;
  protected users: String[] = [];//hiring poc
  protected projects: String[] = [];//projectname
  protected clientsPoc: String[] = [];
  protected clients: string[] = []
  private clientsMaster: { clientId: number; clientName: string }[] = [];
  private clientNameToId: Map<string, number> = new Map<string, number>();
  

  constructor(private fb: FormBuilder, private userService: UserService, private clientService: ClientService, private projectService: ProjectService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      id: ['',Validators.required],
      requisitionDate: ['',Validators.required],
      project: ['', Validators.required],
      client: [null,Validators.required],
      requisitionType: ['',Validators.required],
      requisitionStage: ['',Validators.required],
      skills: ['',Validators.required],
      hiringPoc: ['',Validators.required],
      clientPoc: [{ value: null, disabled: true },Validators.required],
      fulfillmentMedium: ['',Validators.required],
      urgency: ['',Validators.required],
      requisitionStatus: ['',Validators.required],
      fteHeadCount: [0],
      fteTotalAllocation: [0,Validators.pattern('^[0-9]*$')],
      fulfilledAllocation: [0,Validators.pattern('^[0-9]*$')],
      notes: [''],
      tentativeOnboardingDate: [''],
      ageingDays: [0],
      capabilityArea: ['',Validators.required],
    });
  }

  ngOnInit(): void {
    this.getReferenceData();
    this.loadDropdownData();
    this.clientPocDisabled();
  }
  /**
   * Fetch reference data from the store and populate local lists for dropdowns.
   * @returns void
   */
  getReferenceData(): void {
    this.store.select(selectAllReferenceData).subscribe((data) => {
      if (data && data.length > 0) {
        const types = data.filter(item => item.categoryName === 'RequisitionType').map(item => item.name);
        const stages = data.filter(item => item.categoryName === 'RequisitionStage').map(item => item.name);
        const urg = data.filter(item => item.categoryName === 'Urgency').map(item => item.name);
        const skills = data.filter(item => item.categoryName === 'Skills').map(item => item.name);
        const capa = data.filter(item => item.categoryName === 'CapabilityArea').map(item => item.name)
        const status = data.filter(item => item.categoryName === 'RequisitionStatus').map(item => item.name)
        const medium = data.filter(item => item.categoryName === 'FulfillmentMedium').map(item => item.name)

        this.referenceLists['requisitionTypes'] = types;
        this.referenceLists['requisitionStages'] = stages;
        this.referenceLists['urgencies'] = urg;
        this.referenceLists['skill'] = skills;
        this.referenceLists['capability'] = capa;
        this.referenceLists['requisitionStatus'] = status;
        this.referenceLists['fulfillmentMedium'] = medium;

        this.requisitionTypes = [...types];
        this.requisitionStages = [...stages];
        this.urgencies = [...urg];
        this.skill = [...skills];
        this.capability = [...capa];
        this.requisitionStatus = [...status]
        this.fulfillmentMedium = [...medium]
      }
    });
  }
  /**
   * Generic filter handler for multiple autocomplete dropdowns.
   * - `key` must match one of: 'requisitionTypes' | 'requisitionStages' | 'urgencies'
   */
  filterDropdown(event: AutoCompleteCompleteEvent, key: string): void {
    const source = this.referenceLists[key] ?? [];
    const query = (event?.query ?? '').toString().trim();

    const filtered = query
      ? source.filter(item => item?.toString().toLowerCase().includes(query.toLowerCase()))
      : [...source];

    switch (key) {
      case 'requisitionTypes':
        this.requisitionTypes = filtered;
        break;
      case 'users':
        this.users = filtered;
        break;
      case 'skill':
        this.skill = filtered;
        break;
      case 'projects':
        this.projects = filtered;
        break;
      case 'capability':
        this.capability = filtered;
        break;
      case 'fulfillmentMedium':
        this.fulfillmentMedium = filtered;
        break;
      case 'clientsPoc':
        this.clientsPoc = filtered;
        break;
      case 'clients':
        this.clients = filtered;
        break;
      case 'requisitionStages':
        this.requisitionStages = filtered;
        break;
      case 'requisitionStatus':
        this.requisitionStatus = filtered;
        break;
      case 'urgencies':
        this.urgencies = filtered;
        break;
      default:
        break;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
  
private clientPocDisabled(): void {
  this.form.get('client')!.valueChanges.subscribe((clientName: string | null) => {
    const clientPocCtrl = this.form.get('clientPoc')!;

    if (clientName) {
      clientPocCtrl.enable();
      const clientId = this.clientNameToId.get((clientName || '').trim());

      if (clientId) {
        //fetch name
        this.clientService.getAllClientManagers(clientId).subscribe((clientData) => {
          this.referenceLists ??= {};
          this.referenceLists['clientsPoc'] = (clientData ?? []).map(c =>
            `${(c.managerName || '').trim()}`.trim()
          );
          this.clientsPoc = [...this.referenceLists['clientsPoc']];
        });
      } else {
        // If no id no clientpoc
        clientPocCtrl.reset();
        clientPocCtrl.disable();
        this.clientsPoc = [];
      }
    }
  });
}

  private loadDropdownData() {
    this.userService.getAllUsers().subscribe((data) => {
      this.referenceLists ??= {};
      this.referenceLists['users'] = data.map(u =>
        `${(u.firstName || '').trim()} ${(u.lastName || '').trim()}`.trim()
      );
      this.users = [...this.referenceLists['users']];
    });
    //project service
    this.projectService.getAllProjects().subscribe((projectData) => {
      this.referenceLists ??= {};
      this.referenceLists['projects'] = projectData.map(p =>
        `${(p.projectName || '').trim()}`.trim()
      );
      this.projects = [...this.referenceLists['projects']];
    });

    //client poc service
    this.clientService.getAllClientManagers(3).subscribe((clientData) => {
      this.referenceLists ??= {};
      this.referenceLists['clientsPoc'] = clientData.map(c =>
        `${(c.managerName || '').trim()}`.trim()
      );
      this.clientsPoc = [...this.referenceLists['clientsPoc']];
    });

    this.clientService.getAllClients().subscribe((data) => {
  // Save full list for lookup later
  this.clientsMaster = data ?? [];
  this.clientNameToId.clear();
  this.clientsMaster.forEach(c => this.clientNameToId.set((c.clientName || '').trim(), c.clientId));
  this.referenceLists ??= {};
  this.referenceLists['clients'] = this.clientsMaster.map(c => (c.clientName || '').trim());
  this.clients = [...this.referenceLists['clients']];
});
  }
}