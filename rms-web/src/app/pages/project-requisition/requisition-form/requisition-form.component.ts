import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, MinLengthValidator } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Store, StoreModule } from '@ngrx/store';
import { selectAllReferenceData } from '../../../store/reference-data/reference-data.selectors';
import { UserService } from '@core/services/user.service';
import { ClientService } from '@core/services/client.service';
import { ProjectService } from '@core/services/project.service';
import { forkJoin } from 'rxjs';
import { ProjectRequisition } from '@core/interfaces/project-requisition';

@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CommonModule, FormsModule, AutoCompleteModule, StoreModule],
})
export class RequisitionFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() model: ProjectRequisition | null = null;
  @Input() isAdd = false;

  private store = inject(Store);
  private referenceLists: Record<string, string[]> = {};
  private metaData: Record<string, any> = {};

  protected form: FormGroup;
  protected requisitionTypes: string[] = [];
  protected requisitionStages: string[] = [];
  protected urgencies: string[] = [];
  protected skills: string[] = [];
  protected fulfillmentMedium: string[] = [];
  protected requisitionStatus: string[] = [];
  protected users: String[] = [];
  protected projects: String[] = [];
  protected clientsPoc: String[] = [];
  protected clients: string[] = [];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private clientService: ClientService,
    private projectService: ProjectService) {
    this.form = this.fb.group({
      requisitionDate: ['', Validators.required],
      project: ['', Validators.required],
      client: ['', Validators.required],
      requisitionType: ['', Validators.required],
      requisitionStage: ['', Validators.required],
      skills: ['', Validators.required],
      hiringPoc: ['', Validators.required],
      clientPoc: [{ value: '', disabled: true }, Validators.required],
      fulfillmentMedium: ['', Validators.required],
      requisitionStatus: ['', Validators.required],
      fteHeadCount: [0, Validators.min(0)],
      fteTotalAllocation: [0, Validators.pattern('^[0-9]*$')],
      fulfilledAllocation: [0, Validators.pattern('^[0-9]*$')],
      notes: [''],
      tentativeOnboardingDate: [''],
      ageingDays: [0]
    });
  }

  ngOnInit(): void {
    this.getReferenceData();
    this.loadDropdownData();
    this.clientPocDisabled();
  }

  /**
     * Loads the data for Edit form 
     * @returns void
     */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['model']) return;

    if (!this.model) {
      this.form.reset();
      return;
    }
    this.form.patchValue({
      requisitionDate: this.model.requisitionDate,
      ageingDays: this.model.ageingDays,
      fteHeadCount: this.model.fteHeadCount,
      client: this.model.clientName,
      project: this.model.projectName,
      skills: this.model.skill,
      hiringPoc: this.model.hiringPocName,
      clientPoc: this.model.clientPocName,
      notes: this.model.notes
    });
  }

  /**
   * Fetch reference data from the store and populate local lists for dropdowns.
   * @returns void
   */
  getReferenceData(): void {
    this.store.select(selectAllReferenceData).subscribe((data) => {
      if (data && data.length > 0) {
        this.metaData = { "referenceData": data };
        this.form.patchValue({
          requisitionStage: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'RequisitionStage' && this.model?.requisitionStageId === r.id)?.name,
          requisitionStatus: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'RequisitionStatus' && this.model?.requisitionStatusId === r.id)?.name,
          requisitionType: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'RequisitionType' && this.model?.requisitionTypeId === r.id)?.name,
          fulfillmentMedium: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'FulfillmentMedium' && this.model?.fulfillmentMediumId === r.id)?.name,
        });

        const mapping: [string, string][] = [
          ['RequisitionType', 'requisitionTypes'],
          ['RequisitionStage', 'requisitionStages'],
          ['Skills', 'skill'],
          ['RequisitionStatus', 'requisitionStatus'],
          ['FulfillmentMedium', 'fulfillmentMedium'],
        ];

        mapping.forEach(([category, key]) => {
          const list = (data ?? []).filter(item => item.categoryName === category).map(item => item.name);
          this.referenceLists[key] = list;
          (this as any)[key] = [...list];
        });

        const reqCtrl = this.form.get('requisitionStage');
        if (this.isAdd) {
          const approval = this.requisitionStages?.find(s => s?.toLowerCase() === 'approval');
          if (approval) {
            reqCtrl?.setValue(approval, { emitEvent: false });
          } else if (!reqCtrl?.value && this.requisitionStages?.length) {
            reqCtrl?.setValue(this.requisitionStages[0], { emitEvent: false });
          }
          reqCtrl?.disable({ emitEvent: false });
        }
        if (this.isAdd) {
          const today = new Date().toISOString().split('T')[0];
          this.form.get('requisitionDate')?.setValue(today);
        }
      }
    });
  }

  /**
   * Generic filter handler for multiple autocomplete dropdowns.
   * - `key` must match one of: 'requisitionTypes' | 'requisitionStages' | 'urgencies'
   * @returns void
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
        this.skills = filtered;
        break;
      case 'projects':
        this.projects = filtered;
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
      default:
        break;
    }
  }

  /**
   * Handle form submission.
   * Emits the form value if valid, otherwise marks all controls as touched.
   * @returns void
   */
  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const payload = {
        requisitionDate: new Date(this.form.value.requisitionDate),
        projectId: this.metaData['projects']?.find((p: any) => (p.projectName || '').trim() === (this.form.value.project || '').trim())?.projectId,
        requisitionTypeId: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'RequisitionType' && r.name === this.form.value.requisitionType)?.id,
        requisitionStageId: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'RequisitionStage' && r.name === raw.requisitionStage)?.id,
        hiringPocId: this.metaData['users']?.find((u: any) => {const fullName = `${(u.firstName || '').trim()} ${(u.lastName || '').trim()}`.trim(); return fullName === (this.form.value.hiringPoc || '').trim();})?.id,
        skillId: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'Skills' && r.name === this.form.value.skills)?.id,
        clientPocId: this.metaData['managers']?.find((m: any) => (m.managerName || '').trim() === (this.form.value.clientPoc || '').trim())?.managerId,
        fulfillmentMediumId: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'FulfillmentMedium' && r.name === this.form.value.fulfillmentMedium)?.id,
        requisitionStatusId: this.metaData['referenceData']?.find((r: any) => r.categoryName === 'RequisitionStatus' && r.name === this.form.value.requisitionStatus)?.id,
        fteHeadCount: this.form.value.fteHeadCount,
        fteTotalAllocation: this.form.value.fteTotalAllocation,
        fulfilledAllocation: 0,
        notes: raw.notes,
        tentativeOnboardingDate: new Date(this.form.value.tentativeOnboardingDate),
        ageingDays: this.form.value.ageingDays
      };
      this.submitted.emit(payload);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Handle form cancellation.
   * Emits the cancel event.
   * @returns void
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Enable/disable clientPoc control based on client selection.
   * Fetches client POCs when a valid client is selected.
   * @returns void
   */
  private clientPocDisabled(): void {
    this.form.get('client')!.valueChanges.subscribe(clientName => {
      const ctrl = this.form.get('clientPoc')!;
      const name = (clientName ?? '').toString().trim();
      const resetDisable = () => { ctrl.reset(); ctrl.disable(); this.referenceLists['clientsPoc'] = []; this.clientsPoc = []; };

      if (!name) { resetDisable(); return; }

      ctrl.enable();
      const client = (this.metaData['clients'] || []).find((c: any) => ((c.clientName || '').trim() === name));
      if (!client?.clientId) { resetDisable(); return; }

      this.clientService.getAllClientManagers(client.clientId).subscribe({
        next: managers => {
          this.metaData = { ...this.metaData, managers };
          const list = (managers ?? []).map((m: any) => m.managerName ?? '');
          this.referenceLists['clientsPoc'] = list;
          this.clientsPoc = [...list];
        },
        error: () => resetDisable()
      });
    });
  }

  /**
   * Load dropdown data for users, projects, and clients.
   * @returns void
   */
  private loadDropdownData(): void {
    forkJoin({
      users: this.userService.getAllUsers(),
      projects: this.projectService.getAllProjects(),
      clients: this.clientService.getAllClients()
    }).subscribe(({ users, projects, clients }) => {
      this.metaData = { ...this.metaData, users, projects, clients };

      this.referenceLists['users'] = (users ?? []).map(u =>
        `${(u.firstName || '').trim()} ${(u.lastName || '').trim()}`.trim()
      );
      this.referenceLists['projects'] = (projects ?? []).map(p => (p.projectName || '').trim());
      this.referenceLists['clients'] = (clients ?? []).map(c => (c.clientName || '').trim());

      this.users = [...this.referenceLists['users']];
      this.projects = [...this.referenceLists['projects']];
      this.clients = [...this.referenceLists['clients']];
    });
  }
}