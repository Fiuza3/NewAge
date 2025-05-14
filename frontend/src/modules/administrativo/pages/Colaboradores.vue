<template>
  <div class="colaboradores">
    <div class="d-flex justify-space-between align-center na-mb-3">
      <h1>Colaboradores</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/administrativo/colaboradores/novo">
        Novo Colaborador
      </v-btn>
    </div>
    
    <base-card>
      <div class="d-flex align-center na-mb-3">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar colaboradores"
          single-line
          hide-details
          class="mr-3"
        ></v-text-field>
        
        <v-select
          v-model="departamentoFiltro"
          :items="departamentos"
          item-title="nome"
          item-value="id"
          label="Filtrar por departamento"
          clearable
          hide-details
          @update:model-value="filtrarPorDepartamento"
        ></v-select>
      </div>
      
      <base-table
        :headers="headers"
        :items="colaboradores"
        :loading="loading"
        :search="search"
      >
        <template v-slot:item.salario="{ item }">
          {{ formatarMoeda(item.salario) }}
        </template>
        
        <template v-slot:item.dataAdmissao="{ item }">
          {{ formatarData(item.dataAdmissao) }}
        </template>
        
        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            :to="`/administrativo/colaboradores/${item.id}`"
            title="Editar"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="error"
            @click="confirmarExclusao(item)"
            title="Excluir"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </base-table>
      
      <!-- Scroll infinito -->
      <div class="text-center na-mt-3" v-if="temMaisPaginas">
        <v-btn
          color="primary"
          variant="text"
          :loading="carregandoMais"
          @click="carregarMais"
        >
          Carregar mais
        </v-btn>
      </div>
    </base-card>
    
    <!-- Dialog de confirmação de exclusão -->
    <base-dialog
      v-model="dialogExclusao"
      title="Confirmar exclusão"
      max-width="400px"
    >
      <p>Deseja realmente excluir o colaborador <strong>{{ colaboradorSelecionado?.nome }}</strong>?</p>
      <p class="na-mt-2">Esta ação não poderá ser desfeita.</p>
      
      <template #actions>
        <v-btn color="default" variant="text" @click="dialogExclusao = false">
          Cancelar
        </v-btn>
        <v-btn color="error" @click="excluirColaborador" :loading="excluindo">
          Excluir
        </v-btn>
      </template>
    </base-dialog>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import colaboradorService, { Colaborador } from '../services/colaboradorService'
import departamentoService, { Departamento } from '../services/departamentoService'

export default defineComponent({
  name: 'Colaboradores',
  components: {
    BaseCard,
    BaseTable,
    BaseDialog,
    BaseSnackbar
  },
  setup() {
    const colaboradores = ref<Colaborador[]>([])
    const departamentos = ref<Departamento[]>([])
    const loading = ref(true)
    const carregandoMais = ref(false)
    const search = ref('')
    const departamentoFiltro = ref<number | null>(null)
    const dialogExclusao = ref(false)
    const colaboradorSelecionado = ref<Colaborador | null>(null)
    const excluindo = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Paginação
    const paginaAtual = ref(1)
    const limitePorPagina = ref(10)
    const totalItens = ref(0)
    const temMaisPaginas = ref(false)
    
    // Definição das colunas da tabela
    const headers = [
      { title: 'Nome', key: 'nome' },
      { title: 'Cargo', key: 'cargo' },
      { title: 'Salário', key: 'salario' },
      { title: 'Data de Admissão', key: 'dataAdmissao' },
      { title: 'Departamento', key: 'departamentoNome' },
      { title: 'Ações', key: 'acoes', sortable: false }
    ]
    
    // Carrega a lista de colaboradores
    const carregarColaboradores = async (pagina: number = 1) => {
      if (pagina === 1) loading.value = true
      else carregandoMais.value = true
      
      try {
        const resultado = await colaboradorService.listar(pagina, limitePorPagina.value)
        
        if (pagina === 1) {
          colaboradores.value = resultado.data
        } else {
          colaboradores.value = [...colaboradores.value, ...resultado.data]
        }
        
        totalItens.value = resultado.total
        temMaisPaginas.value = colaboradores.value.length < totalItens.value
        paginaAtual.value = pagina
      } catch (error) {
        mostrarNotificacao('Erro ao carregar colaboradores', 'error')
        console.error(error)
      } finally {
        loading.value = false
        carregandoMais.value = false
      }
    }
    
    // Carrega mais colaboradores (scroll infinito)
    const carregarMais = () => {
      carregarColaboradores(paginaAtual.value + 1)
    }
    
    // Carrega a lista de departamentos para o filtro
    const carregarDepartamentos = async () => {
      try {
        departamentos.value = await departamentoService.listar()
      } catch (error) {
        console.error(error)
      }
    }
    
    // Filtra colaboradores por departamento
    const filtrarPorDepartamento = async () => {
      if (!departamentoFiltro.value) {
        carregarColaboradores(1)
        return
      }
      
      loading.value = true
      try {
        const resultado = await colaboradorService.listarPorDepartamento(departamentoFiltro.value)
        colaboradores.value = resultado
        temMaisPaginas.value = false
      } catch (error) {
        mostrarNotificacao('Erro ao filtrar colaboradores', 'error')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // Confirma a exclusão de um colaborador
    const confirmarExclusao = (colaborador: Colaborador) => {
      colaboradorSelecionado.value = colaborador
      dialogExclusao.value = true
    }
    
    // Exclui o colaborador selecionado
    const excluirColaborador = async () => {
      if (!colaboradorSelecionado.value?.id) return
      
      excluindo.value = true
      try {
        await colaboradorService.remover(colaboradorSelecionado.value.id)
        mostrarNotificacao('Colaborador excluído com sucesso')
        dialogExclusao.value = false
        carregarColaboradores(1)
      } catch (error) {
        mostrarNotificacao('Erro ao excluir colaborador', 'error')
        console.error(error)
      } finally {
        excluindo.value = false
      }
    }
    
    // Formata o valor monetário
    const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor)
    }
    
    // Formata a data
    const formatarData = (data: string) => {
      return new Date(data).toLocaleDateString('pt-BR')
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarColaboradores()
      carregarDepartamentos()
    })
    
    return {
      colaboradores,
      departamentos,
      loading,
      carregandoMais,
      search,
      departamentoFiltro,
      headers,
      dialogExclusao,
      colaboradorSelecionado,
      excluindo,
      snackbar,
      temMaisPaginas,
      filtrarPorDepartamento,
      carregarMais,
      confirmarExclusao,
      excluirColaborador,
      formatarMoeda,
      formatarData
    }
  }
})
</script>