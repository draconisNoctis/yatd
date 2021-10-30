import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ObjectRegistryService } from '@yatd/engine';
import { assert } from '@yatd/utils';

@Component({
    selector: 'yatd-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements AfterViewInit {
    readonly displayedColumns = ['id', 'name', 'type', 'actions'];

    @ViewChild(MatPaginator)
    paginator?: MatPaginator;

    dataSource = new MatTableDataSource([...this.objectRegistryService.list()].filter(d => !d.internal));

    constructor(protected readonly objectRegistryService: ObjectRegistryService) {}

    ngAfterViewInit(): void {
        assert(this.paginator, 'Paginator should be provided');

        this.dataSource.paginator = this.paginator;
    }
}
