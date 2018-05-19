import { Component, OnInit }		from '@angular/core'
import { ActivatedRoute, ParamMap }	from '@angular/router'

import { SubmitService }			from './submit.service'

import 'rxjs/add/operator/switchMap'

@Component({
	selector: 'submit',
	templateUrl: './submit.html'
})
export class SubmitComponent implements OnInit {

	problemName = ''
	problemId = 0
	participantCode = ''
	submissions: Submit[] = []
	languages: string[] = []
	selectLanguage: string

	constructor(
		private submitService: SubmitService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.route.paramMap
			.switchMap((params: ParamMap) =>
				this.submitService.getStatus(params.get('id')))
			.subscribe(
				problemStatus => {
					this.problemId = problemStatus['problem']['id']
					this.problemName = problemStatus['problem']['name']
					this.submissions = []
					for (let submit of problemStatus['submissions']) {
						let currentSubmit: Submit = {
							id: submit['id'],
							status: submit['status'],
							submTime: submit['submTime'],
							verdict: submit['verdict'],
							testId: submit['testId'],
							comment: submit['comment']
						}
						this.submissions.push(currentSubmit)
					}
				}
			)
		this.submitService.getLanguages()
			.then(response => {
				for (let i in response['languages']) {
					if (response['languages'].hasOwnProperty(i)) {
						this.languages.push(response['languages'][i])
					}
				}
				if (this.languages.length > 0) {
					this.selectLanguage = this.languages[0]
				}
			})
	}

	update(newCode: string) {
		this.participantCode = newCode
	}

	uglify(text: string) {
		let from = [/"/gi, /\n/gi, /\t/gi]
		let to = ['\\"', '\\n', '\\t']
		let new_text = text
		for (let i in from) {
			if (from.hasOwnProperty(i) && to.hasOwnProperty(i)) {
				new_text = new_text.replace(from[i], to[i])
			}
		}
		return new_text
	}

	submitSolution() {
		this.submitService.submit(this.problemId, this.uglify(this.participantCode), this.selectLanguage)
			.then(
				response => {
					this.ngOnInit()
				}
			)
	}

	uploadSolution(fileList: FileList) {
		let fileReader = new FileReader()
		fileReader.onload = (e) => {
				this.participantCode = fileReader.result
				let submitArea = document.getElementById('submitArea')
				submitArea.innerHTML = this.participantCode
			}
		fileReader.readAsText(fileList[0])
	}

}

class Submit {
	id: number
	status: string
	submTime: string
	verdict: string
	testId: number
	comment: string
}
